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
  madeWith: String,
  date: String,
  description: String,
  demo: String,
  github: String
});

const Project = mongoose.model('project', projectSchema);

module.exports = Project;
