# connect-cgi-mock HTTP接口模拟器
> 本组件为connect中间件，为本地web前端开发提供模拟HTTP接口。
> 

## 快速上手
> 以gulp-connect搭建本地HTTP服务器为例
> 
`javascript
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
`