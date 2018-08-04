const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    username: String,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  text: String,
  created: Date
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
