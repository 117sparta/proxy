var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var http = require('http');
var https = require('https');
var proxyConfig = require(path.resolve(__dirname, 'proxyConfig.js')); // 读取中间件代理的配置文件

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', async function (req, res, next) {
  const path = req.originalUrl; // 获取请求的路径和参数
  const headers = {
    ...req.headers // 原请求的头部
  };
  const options = {
    method: req.method,
    hostname: proxyConfig.host,
    port: proxyConfig.port,
    path
  };
  if (req.method.toLowerCase() === 'post') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'; // 给post加额外的头部
    options.headers = headers;
  }
  const outerRes = res;
  const requestClient = proxyConfig.protocol === 'https' ? https : http; // 看使用http还是https发送请求
  const request = requestClient.request(options, (res) => {
    let data = '';
    res.on('data', (d) => {
      data += d;
    });
    res.on('end', () => {
      outerRes.end(data); // send data back to origin client after getting all the data needed
    });
  });
  request.end(); // 请求发送完成
  request.on('error', (err) => {
    console.log(err);
  }); // 打印错误
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
