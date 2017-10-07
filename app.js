const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//PassportJS to support local username/password strategy
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
//Express routers
const index = require('./routes/index');
const users = require('./routes/users');
const entries = require('./routes/entries');
const useradmin = require('./routes/admin/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var dburl='mongodb://localhost/blog_sample';
mongoose.connect(dburl, {
  useMongoClient: true
}).then(
  () => {
    console.log('Connected to MongoDB');
  },
  err => {
    console.log('MongoDB connection failed: ' + err);
    process.exit(1);
  }
);

//Setup session handler
app.use(require('express-session')({
  secret: 'AddYourSessionSecretHere',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Setup routers
app.use('/', index);
app.use('/users', users);
app.use('/entries', entries);
app.use('/admin/users', useradmin);

//Configure passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  //only providing error in development
  var error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({
    message: err.message,
    error: error
  });
});

module.exports = app;
