var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/dashboard', function(req, res) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    res.render('dashboard');
  }
});

module.exports = router;
