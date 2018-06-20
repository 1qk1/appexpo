const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  Project = require('./models/project'),
  User = require('./models/user'),
  bodyParser = require('body-parser'),
  bcrypt = require('bcrypt'),
  private = require('./private');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(private.mongoURI, () => {
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
  res.render('login', { message: undefined });
});

app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }).then(result => {
    if (!result) {
      res.render('login', { message: 'User not found' });
    } else {
      bcrypt.compare(req.body.password, result.password, (error, response) => {
        if (!response) {
          res.render('login', { message: 'Wrong password' })
        } else {
          console.log('res', response);
          //cookies and shit
        }
      });
    }
  })
});

app.get('/register', (req, res) => {
  res.render('register', { message: undefined });
});

app.post('/register', (req, res) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    joinDate: new Date()
  }
  if (req.body.password[0] !== req.body.password[1]) {
    res.render('register', { message: "Passwords don't match" });
  } else {
    User.findOne({ username: req.body.username }).then(result => {
      if (result !== null) {
        res.render('register', { message: 'User already exists' });
      } else {
        bcrypt.hash(req.body.password[0], 14, (err, hashedPassword) => {
          newUser.password = hashedPassword;
          newUser.save().then((err, user) => {
            if (error) {
              console.log('error', err);
              res.render('register', { message: error });
            } else {
              console.log('user', user);
              res.redirect('/');
            }
          });
        });
      }
    });
  }
});

app.get('*', (req, res) => {
  res.redirect('/');
});

const port = process.env.PORT;

app.listen(port, process.env.IP, () => {
  console.log('App listening on port ' + port);
});
