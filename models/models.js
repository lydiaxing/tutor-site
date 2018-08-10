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

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
}
