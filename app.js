var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var auth = require('./routes/auth');

var models = require('./models/models');
var User = models.User;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(email, password, done) {
  console.log('local strategy is getting called', email, password)
  User.findOne({
    email: email
  }, function(err, user) {
    if (err) {
      console.log(err);
      return done(err);
    }

    if (!user) {
      console.log('no user', user);
      return done(null, false);
    }

    if (user.password !== password) {
      return done(null, false);
    }

    return done(null, user);
  })
}));

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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
