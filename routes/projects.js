const router = require('express').Router(),
      User = require('../models/user'),
      Project = require('../models/project'),
      isLoggedIn = require('../utils').isLoggedIn,
      isImage = require('is-image');

router.get('/new', isLoggedIn, (req, res) => {
  res.render('new');
});

router.post('/new', isLoggedIn, (req, res) => {
  if (isImage(req.body.image)) {
    User.findById(req.session.user.id, (err, foundUser) => {
      const project = new Project({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        uploader: {
          username: req.session.user.username,
          id: req.session.user.id,
        }
      });
      project.save((err, savedProject) => {
        if (err) {
          console.log(err);
          res.render('new', {message: 'Something went wrong'});
        } else {
          foundUser.projects.push(savedProject);
          foundUser.save((err, savedUser) => {
            if (err) {
              console.log(err);
              res.render('new', {message: 'Something went wrong'});
            } else {
              console.log(savedUser);
              res.redirect('/');
            }
          });
        }
      });
    });
  } else {
    res.render('new', {message: 'Invalid image URL'});
  }
});

module.exports = router;