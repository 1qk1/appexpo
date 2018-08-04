const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  },
  text: String
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
