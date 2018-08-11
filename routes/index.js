var express = require('express');
var router = express.Router();
var stripePackage = require('stripe');
const stripe = stripePackage(process.env.SECRET_KEY);
var models = require('../models/models');
var nl2br = require('nl2br');

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Content.getContent(function(err, content) {
    res.render('index', {content: content});
  });
});

router.get('/dashboard', function(req, res) {
  res.render('dashboard', {PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY});
});

router.post('/checkout', function(req, res) {
  const token = request.body.stripeToken;

  stripe.customers.create({email: req.user.username, source: token}).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({amount: 999, description: 'Example charge', currency: "usd", customer: customer.id});
  }).then(function() {
    res.render('dashboard');
  });
});

router.post('/admin', function(req, res) {
  models.Content.getContent(function(err, content) {
    content.set({
      nav: req.body.nav,
      splashBig: req.body.splashBig,
      splashSmall: req.body.splashSubheader,
      about: nl2br(req.body.about, false),
      free: nl2br(req.body.assessment, false),
      other: nl2br(req.body.others, false),
      beginner: nl2br(req.body.beginnerDesc, false),
      intermediate: nl2br(req.body.intermediateDesc, false),
      adv: nl2br(req.body.advDesc, false),
      why: nl2br(req.body.whyDesc, false)
    });
    content.save();
    res.redirect('/admin');
  });
});

router.get('/admin', function(req, res) {
  if (req.user) {
    models.Content.getContent(function(err, content) {
      content.set({
        about: content.about.replace(/<br>/g, ''),
        free: content.free.replace(/<br>/g, ''),
        other: content.other.replace(/<br>/g, ''),
        beginner: content.beginner.replace(/<br>/g, ''),
        intermediate: content.intermediate.replace(/<br>/g, ''),
        adv: content.adv.replace(/<br>/g, ''),
        why: content.why.replace(/<br>/g, '')
      });
      res.render('admin', {content: content});
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
