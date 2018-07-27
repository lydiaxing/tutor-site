var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

var userSchema = new mongoose.Schema({
  email: String,
  password: String
});

var paymentSchema = new mongoose.Schema({

});

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
};
