var connect = require('connect');
var request = require('supertest');
var cgiMock = require('../index');

describe('test mock router', function(){
    var app;

    beforeEach(function(){
        app = connect();

        app.use(cgiMock({
            // cgi模拟数据文件根目录（本地目录）
            root: __dirname + '/mock',

            // HTTP路由根路径（请求路径中/api下所有请求都会认为是CGI请求）
            // 路由支持 字符串（仅支持根路径起）/正则/函数
            route: '/api'
        }));
    });

    it('should fetch empty JSON', function(done){
        request(app)
        .get('/api/empty')
        .expect(200, done);
    });

    it('should get 404 response', function(done){
        request(app)
        .get('/api/noexist')
        .expect(404, done);
    });
});

describe('test mock response', function(){
    var app;

    beforeEach(function(){
        app = connect();

        app.use(cgiMock({
            // cgi模拟数据文件根目录（本地目录）
            root: __dirname + '/mock',

            // HTTP路由根路径（请求路径中/api下所有请求都会认为是CGI请求）
            // 路由支持 字符串（仅支持根路径起）/正则/函数
            route: '/api'
        }));
    });

    it('should successfully get a JSON reponse', function(done){
        request(app)
        .get('/api/success')
        .expect('Content-Type', /json/)
        .expect(200, {
            success: true
        }, done);
    });

    it('should get error response', function(done){
        request(app)
        .get('/api/error')
        .expect('Content-Type', /json/)
        .expect(608, {
            code: 123,
            message: 'error message'
        }, done);
    });
});

describe('test mock advanced response manipulation', function(){
    var app;

    beforeEach(function(){
        app = connect();

        app.use(cgiMock({
            // cgi模拟数据文件根目录（本地目录）
            root: __dirname + '/mock',

            // HTTP路由根路径（请求路径中/api下所有请求都会认为是CGI请求）
            // 路由支持 字符串（仅支持根路径起）/正则/函数
            route: '/api'
        }));
    });

    it('should set cookie successfully', function(done){
        request(app)
        .get('/api/set-cookie')
        .expect('set-cookie', 'a=1,b=2', done);
    });

    it('should set header successfully', function(done){
        request(app)
        .get('/api/header')
        .expect('token', 'xxoo', done);
    });
});