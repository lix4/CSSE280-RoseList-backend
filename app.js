var express = require('express');
var cors = require('cors');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var RosefireTokenVerifier = require('rosefire-node');

var db = require('./model/db');

var index = require('./routes/index');
var posts = require('./routes/posts');
var users = require('./routes/users')

var rosefire = new RosefireTokenVerifier('whatalovelyday');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/posts', posts);
app.use('/users', users);
//app.use(expressJWT.({ secret: 'whatalovelyday'}).unless({path: }))


app.post('/users', function (req, res) {
  var token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      error: 'Not authorized!'
    });
    return;
  }
  token = token.split(' ')[1]; 
  rosefire.verify(token, function(err, authData) {
    if (err) {
      res.status(401).json({
        error: 'Not authorized!'
      });
    } else {
      console.log(authData.username); // rockwotj
      console.log(authData.issued_at); // <Date Object of issued time> 
      console.log(authData.group); // STUDENT (Only there if options asked)
      console.log(authData.expires) // <Date Object> (Only there if options asked)
      res.json(authData);
    }
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
