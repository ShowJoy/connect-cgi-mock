# connect-cgi-mock HTTP接口模拟器[![Build Status](https://travis-ci.org/FroadUED/connect-cgi-mock.svg?branch=master)](https://travis-ci.org/FroadUED/connect-cgi-mock)
> 本组件为connect中间件，为本地web前端开发提供模拟HTTP接口。

## 快速上手
> 以gulp-connect搭建本地HTTP服务器为例

```javascript
connect.server({
    root: 'dev',
    livereload: true,
    middleware: function(){
        return [
            // 这里开始为connect-cgi-mock配置
            cgiMock({
                // cgi模拟数据文件根目录（本地目录）
                root: __dirname + '/src/cgiMock',

                // HTTP路由根路径（请求路径中/api下所有请求都会认为是CGI请求）
                // 路由支持 字符串（仅支持根路径起）/正则/函数
                route: '/api'
            })
        ]
    }
});
```

## CGI模拟示例
以模拟/api/cgiName为例，配置同上述配置
CGI模拟数据文件路径为：
`/src/cgiMock/api/cgiName.js`

数据内容为：
```javascript
// req is request object
// see https://nodejs.org/api/http.html#http_http_incomingmessage

// request url
var url = req.url,
    // query object, parsed from query string
    query = req.query,
    // request data, parsed from request body
    data = req.data;

// get request headers
var contentType = req.headers['Content-Type'];

// next(err, data)
next(null, {
    test: 'ok',
    url: req.url,
    query: req.query,
    data: req.data,
    ct: contentType
});
```

模拟错误
```javascript
// create error object with error message
var err = new Error('error message');

// error code
err.code = 12345;

// http status code in response header
// default code 500, if not manually set
err.statusCode = 608;

// send error to browser
next(err);
```

定制HTTP头
```javascript
// set special header
res.setHeader('token', 'yourToken');

// set cookie
res.setHeader('Set-Cookie', ['a=1', 'b=2']); // 要注意，如果你用chrome在localhost下模拟请求，这样是写不了cookie的，http://stackoverflow.com/questions/1134290/cookies-on-localhost-with-explicit-domain && https://code.google.com/p/chromium/issues/detail?id=56211

// send error to browser
next(null, {
    result: 'ok'
});
```

模拟慢请求
```javascript
// waiting 15s before response
setTimeout(function(){
    next(null, {
        result: 'ok'
    });
}, 15000);
```
