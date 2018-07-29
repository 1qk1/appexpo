const router = require('express').Router(),
      User = require('../models/user'),
      Project = require('../models/project'),
      isLoggedIn = require('../utils').isLoggedIn,
      isImage = require('is-image');

router.get('/new', isLoggedIn, (req, res) => {
  res.render('new');
});

router.post('/new', isLoggedIn, async (req, res) => {
  try {
    if (!isImage(req.body.image)){
      throw new Error('Invalid image URL');
    }
    const user = await User.findById(req.session.user.id);
    const newProject = new Project({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
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
    res.render('new', {message: err.message});
  }
});

module.exports = router;