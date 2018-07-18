const router = require('express').Router(),
      User = require('../models/user'),
      Project = require('../models/project'),
      bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  Project.find({}).then(results => {
    res.render('home', { projects: results.reverse() });
  });
});

router.get('/login', (req, res) => {
  console.log(req.session);
  res.render('login');
});

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (!foundUser) {
      res.render('login', { message: 'User not found' });
    } else {
      bcrypt.compare(req.body.password, foundUser.password, (error, response) => {
        if (!response) {
          res.render('login', { message: 'Wrong password' })
        } else {
          const publicData = {
            id: foundUser._id,
            username: foundUser.username,
            joinDate: foundUser.joinDate,
            posts: foundUser.projects
          }
          req.session.user = publicData;
          res.redirect('/');
        }
      });
    }
  })
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    joinDate: new Date()
  });
  if (req.body.password[0] !== req.body.password[1]) {
    res.render('register', { message: "Passwords don't match" });
  } else {
    User.findOne({ username: req.body.username }).then(result => {
      if (result !== null) {
        res.render('register', { message: 'User already exists' });
      } else {
        bcrypt.hash(req.body.password[0], 14, (err, hashedPassword) => {
          newUser.password = hashedPassword;
          newUser.save().then((user, err) => {
            if (err) {
              console.log('error', err);
              res.render('register', { message: err });
            } else {
              const publicData = {
                id: user._id,
                username: user.username,
                joinDate: user.joinDate,
                posts: user.projects
              }
              req.session.user = publicData;
              res.redirect('/');
            }
          });
        });
      }
    });
  }
});

router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;