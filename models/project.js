const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  image: String,
  uploader: Object,
  demo: String,
  madeWith: String,
  date: String,
  description: String
});

const Project = mongoose.model('project', projectSchema);

module.exports = Project;