const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  image: String,
  uploader: {
    username: String,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  demo: String,
  date: Date,
  description: String,
  demo: String,
  github: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }]
});

const Project = mongoose.model('project', projectSchema);

module.exports = Project;
