var express = require('express');
var router = express.Router();
var models = require('../models/models.js');

module.exports = function(passport) {
  router.get('/login', function(req, res) {
    if (req.user) {
      res.redirect('/admin');
    } else {
      models.Content.getContent(function(err, content) {
        res.render('login', {
          content: content
        })
      });
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

  return router;
}
