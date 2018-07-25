const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      projectRoutes = require('./routes/projects'),
      indexRoutes = require('./routes/index');

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, () => {console.log('Database Connected!')});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('express-session')({
  secret: process.env.EXPRESS_SESSION_KEY,
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.message = undefined;
  next();
});

app.use(projectRoutes);
app.use(indexRoutes);

const port = process.env.PORT || 3000;

app.listen(port, process.env.IP, () => {
  console.log('App listening on port ' + port);
});
