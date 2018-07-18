const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      Project = require('./models/project'),
      User = require('./models/user'),
      bodyParser = require('body-parser'),
      bcrypt = require('bcrypt'),
      isImage = require('is-image');

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, () => {console.log('Database Connected!')});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('express-session')({
  secret: 'super secret key l0l',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.message = undefined;
  next();
});

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

app.get('/', (req, res) => {
  Project.find({}).then(results => {
    res.render('home', { projects: results.reverse() });
  });
});

app.get('/new', isLoggedIn, (req, res) => {
  res.render('new');
});

app.post('/new', isLoggedIn, (req, res) => {
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

app.get('/login', (req, res) => {
  console.log(req.session);
  res.render('login');
});

app.post('/login', (req, res) => {
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

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
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

app.get('*', (req, res) => {
  res.redirect('/');
});

const port = process.env.PORT || 3000;

app.listen(port, process.env.IP, () => {
  console.log('App listening on port ' + port);
});
