var express = require('express');
var router = express.Router();
var models = require('../models/models.js');

module.exports = function(passport) {
  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/loginx'
  }));

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  router.get('/admin', function(req, res) {
    if(req.user) {
      res.render('admin');
    } else {
      res.redirect('/login');
    }
  });

  return router;
}
