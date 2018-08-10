var express = require('express');
var router = express.Router();
var stripePackage = require('stripe');
const stripe = stripePackage(process.env.SECRET_KEY);
var models = require('../models/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
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
  models.Content.findOne({}, function(err, res) {
    res.set({
      nav: req.body.nav,
      splashBig: req.body.splashBig,
      splashSmall: req.body.splashSubheader,
      about: req.body.about,
      free: req.body.assessment,
      other: req.body.others,
      beginner: req.body.beginnerDesc,
      intermediate: req.body.intermediateDesc,
      adv: req.body.advDesc,
      why: req.body.whyDesc
    });

    res.save();
  });

  res.redirect('back');
});

router.get('/admin', function(req, res) {
  if (req.user) {
    models.Content.findOne({}, function(err, content) {
      res.render('admin', {
        content: content
      });
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
