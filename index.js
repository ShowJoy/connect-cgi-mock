var fs = require('fs'),
    url = require('url'),
    querystring = require('querystring'),
    _ = require('underscore');

var defaults = {
    root: './src/cgiMock',
    route: '/api'
};

module.exports = function(options){
    options = _.defaults(options, defaults);
    var route = formatRoute(options.route),
        root = options.root;

    console.info('[connect-cgi-mock] inited');

    return function mw(req, res, next){
        if( !route(req.url) ){
            next();
            return;
        }

        // access log
        console.info('[connect-cgi-mock] %s %s', req.method, req.url);

        req.cgiRoot = root;

        bodyParser(req, function(err){
            if( err ){
                error(res, err);
                return;
            }

            handler(req, function(err, ret){
                if( err ){
                    error(res, err);
                    return;
                }

                // todo
                // support customize http head
                res.setHeader('Content-Type', 'application/json');
                res.end(ret);
            });
        });
    };
};

// format route rule
// accepts string, regular expression, function
function formatRoute(route){
    if( typeof route === 'string' || type instanceof String ){
        return function(){
            return function(url){
                // only match url starts with route string
                return url.indexOf(route) === 0;
            };
        }(route);
    }

    if( route instanceof RegExp ){
        return function(){
            return function(url){
                // only match, no capture
                return route.test(url);
            };
        }(route);
    }

    if( route instanceof Function ){
        return route;
    }

    // illegal route
    throw new Error('[connect-cgi-mock] illegal route, check your configuration.');
}

// parse request body
function bodyParser(req, next){
    var chunkArr = [],
        bufLen = 0;

    req.on('data', function(chunk){
        chunkArr.push(chunk);
        bufLen += chunk.length;
    });

    req.on('end', function(){
        var input = Buffer.concat(chunkArr, bufLen).toString();

        try{
            req.data = JSON.parse(input);
        } catch(err){
            req.data = input;
        }

        next();
    });
}

// handler cgi file
function handler(req, next){
    var urlObj = url.parse(req.url);

    fs.readFile(req.cgiRoot + '/' + urlObj.pathname + '.js', function(err, file){
        if( err ){
            err.statusCode = 404;
            next(err);
            return;
        }
        
        try{
            // create mock function from mock file
            var mock = new Function('req', 'next', file.toString());

            // add query object to req
            req.query = querystring.parse(req.url);

            // run mock
            mock(req, function(err, ret){
                // stringify result for http response
                next(err, JSON.stringify(ret));
            });
        } catch(err){
            next(err);
        }
    });
}

// handle errors
function error(res, err){
    // error log
    console.error('[connect-cgi-mock] %s %s', err.code, err.message);

    res.statusCode = err.statusCode || 500;
    res.end(err.message);
}