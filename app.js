'use strict';

var express = require('express'),
  faye    = require('faye'),
  http    = require('http'),
  path    = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bayeux     = require('./bayeux'),
  bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express(),
  server = http.createServer(app);

bayeux.attach(server);

bayeux.on('handshake', function(clientId) {
  console.log('Client connected', clientId);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


setTimeout(function(){
  console.log('sending bayeux');
  bayeux.getClient().publish('/testQueue', Date.now());
}, 5000);


module.exports = server;
