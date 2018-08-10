var express = require('express');
var router = express.Router();
var stripePackage = require('stripe');
const stripe = stripePackage(process.env.SECRET_KEY);

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

module.exports = router;
