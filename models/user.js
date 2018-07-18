const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  joinDate: String,
  email: String,
  projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'project'}]
});

const User = mongoose.model('user', userSchema);

module.exports = User;
