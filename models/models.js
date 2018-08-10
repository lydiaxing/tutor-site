var mongoose = require('mongoose');

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var contentSchema = new mongoose.Schema({
  nav: {
    type: String,
    required: true
  },
  splashBig: {
    type: String,
    required: true
  },
  splashSmall: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  free: {
    type: String,
    required: true
  },
  other: {
    type: String,
    required: true
  },
  beginner: {
    type: String,
    required: true
  },
  intermediate: {
    type: String,
    required: true
  },
  adv: {
    type: String,
    required: true
  },
  why: {
    type: String,
    required: true
  }
});

var User = mongoose.model('User', userSchema);
var Content = mongoose.model('Content', contentSchema);

module.exports = {
  User: User,
  Content: Content
}
