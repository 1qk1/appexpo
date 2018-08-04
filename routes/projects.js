const router = require('express').Router(),
      User = require('../models/user'),
      Project = require('../models/project'),
      { isLoggedIn } = require('../middleware'),
      isImage = require('is-image');

router.get('/new', isLoggedIn, (req, res) => {
  res.render('projects/new');
});

router.post('/new', isLoggedIn, async (req, res) => {
  try {
    const project = req.body.project;
    project.date = new Date();
    project.demo.startsWith('http') ? project.demo : project.demo = 'https://' + project.demo;
    project.github.startsWith('http') ? project.github : project.github = 'https://' + project.github;
    if (!isImage(project.image)){
      throw new Error('Invalid image URL');
    }
    const user = await User.findById(req.session.user.id);
    const newProject = new Project({
      ...project,
      uploader: {
        username: req.session.user.username,
        id: req.session.user.id,
      }
    });
    await newProject.save();
    user.projects.push(newProject);
    await user.save();
    res.redirect('/');
  } catch(err) {
    res.render('projects/new', {message: err.message});
  }
});

router.get('/:id', async (req, res) => {
  // res.send('this is the preview page');
  const project = await Project.findById(req.params.id).populate('comments');
  if (project !== null) {
    res.render('projects/show', {project});
  } else {
    res.redirect('/');
  }
});

module.exports = router;