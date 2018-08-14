var express = require('express');
var router = express.Router();
var stripePackage = require('stripe');
const stripe = stripePackage(process.env.SECRET_KEY);
var models = require('../models/models');
var nl2br = require('nl2br');
var nodemailer = require('nodemailer');
var validator = require("email-validator");

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Content.getContent(function(err, content) {
    res.render('index', {content: content});
  });
});

router.get('/dashboard', function(req, res) {
  console.log(req.body);
  models.Content.getContent(function(err, content) {
    res.render('dashboard', {
      content: content,
      PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY
    });
  });
});

router.post('/checkout', function(req, res) {
  const token = request.body.stripeToken;

  stripe.customers.create({email: req.user.username, source: token}).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({amount: 4000, description: 'Example charge', currency: "usd", customer: customer.id});
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
      questions: nl2br(req.body.questions, false),
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
        questions: content.questions.replace(/<br>/g, ''),
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

router.get('/contact', function(req, res) {
  models.Content.getContent(function(err, content) {
    res.render('contact', {content: content});
  });
});

router.post('/contact', function(req, res) {
  if(!req.body.subject || !req.body.name || !req.body.email || !req.body.message) {
    models.Content.getContent(function(err, content) {
      res.render('contact', {
        content: content,
        error: "Error: All fields are required. Please correct issue(s) and try again."
      });
    });
  }

  if(!validator.validate(req.body.email)) {
    models.Content.getContent(function(err, content) {
      res.render('contact', {
        content: content,
        error: "Error: Invalid email. Please correct and try again."
      });
    });
  }

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.CRED_USER,
      pass: process.env.CRED_PASS
    }
  });
  let mailOptions = {
    to: 'mandarinforprofessionals@gmail.com',
    subject: req.body.subject,
    text: "message from: " + req.body.name +
          '\n' + "reply email: " + req.body.email +
          '\n' + "their message: " + req.body.message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      models.Content.getContent(function(err, content) {
        res.render('contact', {
          content: content,
          error: "Sorry there was an error, please try again."
        });
      });
    }
    models.Content.getContent(function(err, content) {
      res.render('contact', {
        success: "Success! I received your message and will reply as soon as I can to the address " + req.body.email,
        content: content,
      });
    });
  });
});

module.exports = router;
