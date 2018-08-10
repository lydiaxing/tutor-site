var express = require('express');
var router = express.Router();
var models = require('../models/models.js');

module.exports = function(passport) {
  router.get('/login', function(req, res) {
    if(req.user) {
      res.redirect('/admin');
    } else {
      res.render('login');
    }
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login'
  }));

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  router.get('/admin', function(req, res) {
    if (req.user) {
      res.render('admin');
    } else {
      res.redirect('/login');
    }
  });

  return router;
}
