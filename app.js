var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require("express-session")
var bodyParser = require("body-parser");
var bcrypt = require('bcrypt');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var models = require('./models/models');

//setup passport
passport.use(new LocalStrategy(function(username, password, done) {
  if(!username || !password) {
    return done(null, false);
  }

  models.User.findOne({
    username: username
  }, function(err, user) {
    if(!user) {
      return done(null, false);
    }
    
    bcrypt.compare(password, user.password, function(err, res) {
      if (res) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: process.env.SECRET}));
app.use(bodyParser.urlencoded({extended: false}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development'
    ? err
    : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
