var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;

/* GET users listing. */
module.exports = function(passport) {
  router.get('/login', function(req, res) {
    if (req.user) {
      res.redirect('/dashboard');
    } else {
      res.render('login');
    }
  });

  router.get('/register', function(req, res) {
    res.render('register')
  });

  router.post('/register', function(req, res) {
    if(req.body.email && req.body.password) {
      var user = new User({
        email: req.body.email,
        password: req.body.password
      });

      user.save(function(err) {
        if(!err) {
          res.redirect('/login');
        } else {
          console.log('err creating user', err);
          res.status(500).render('/register', {
            error: "Email already in use"
          });
        }
      });
    }
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/asdf'
  }));

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
}
