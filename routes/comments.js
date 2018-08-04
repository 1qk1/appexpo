const router = require('express').Router({mergeParams: true}),
      User = require('../models/user'),
      Project = require('../models/project'),
      Comment = require('../models/comment'),
      { isLoggedIn } = require('../middleware');


router.post('/new', isLoggedIn, async (req, res) => {
  const project = await Project.findById(req.params.id);
  const comment = {text: req.body.text, author: {id: req.session.user.id, username: req.session.user.username}, created: new Date()}
  const newComment = await Comment.create(comment);
  project.comments.push(newComment);
  updatedProject = await project.save();
  console.log(updatedProject);
  res.redirect('/projects/' + req.params.id);
});

module.exports = router;