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
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username })
    if (!foundUser) {
      throw new Error('User doesn\'t exist');
    }
    if (await bcrypt.compare(req.body.password, foundUser.password)) {
      const publicData = {
        id: foundUser._id,
        username: foundUser.username,
        joinDate: foundUser.joinDate,
        posts: foundUser.projects
      }
      req.session.user = publicData;
      res.redirect('/');
    }
  } catch(err) {
    res.render('login', {message: err.message});
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      joinDate: new Date()
    });
    if (req.body.password[0] !== req.body.password[1]){
      throw new Error("Passwords don't match");
    } 
    const searchedUser = await User.findOne({username: req.body.username});
    if (searchedUser) {
      throw new Error('User already exists');
    }
    newUser.password = await bcrypt.hash(req.body.password[0], 14);
    const user = await newUser.save();
    const publicData = {
      id: user._id,
      username: user.username,
      joinDate: user.joinDate,
      posts: user.projects
    }
    req.session.user = publicData;
    res.redirect('/');
  } catch(err) {
    res.render('register', { message: err.message });
  }
});

router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;