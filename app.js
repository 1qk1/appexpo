const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  Project = require('./models/project'),
  User = require('./models/user'),
  bodyParser = require('body-parser'),
  bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://qkxd:appexpo123@ds247290.mlab.com:47290/appexpo', () => {
  console.log('Database Connected!');
});

app.get('/', (req, res) => {
  Project.find({}).then(results => {
    res.render('home', { projects: results });
  });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', (req, res) => {
  console.log(req.body);
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image
  });
  project.save().then(() => {
    res.redirect('/');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register', { message: undefined });
});

app.post('/register', (req, res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password[0],
    email: req.body.email,
    joinDate: new Date()
  }
  if (req.body.password[0] !== req.body.password[1]) {
    res.render('register', { message: "Passwords don't match" });
  }
  User.findOne({ username: req.body.username }).then(result => {
    if (result !== null) {
      res.render('register', { message: 'User already exists' });
    } else {
      newUser.password = bcrypt.hash(newUser.password, 10, (err, salt) => {
        console.log(salt);
        // User.create(newUser).then((err, user) => {
        //   if (err) {
        //     res.render('register', {message: err});
        //   } else {
        //     res.redirect('/');
        //   }
        // });
      });

    }
  });
});

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen('3000', () => {
  console.log('App listening on port 3000');
});
