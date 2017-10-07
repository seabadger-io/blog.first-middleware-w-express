const express = require('express');
const router = express.Router();
const Model = require('../models/user');
const passport = require('passport');
const session = require('./shared/session');

//Helper function to return only a subset of User fields
returnUser = function (user) {
  if (user) {
    return {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName
    };
  } else {
    return {};
  }
};

router.post('/login', passport.authenticate('local'), function (req, res, next) {
    res.json(returnUser(req.user));
  }
);

router.post('/register', function(req, res, next) {
  const user = {
    email: req.body.email,
    displayName: req.body.displayName,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };
  Model.register(new Model(user) , req.body.password, function(err, user) {
      if (err) {
        err.status = 400;
        return next(err);
      }
      passport.authenticate('local')(req, res, function () {
        console.log(req);
        res.json(returnUser(req.user));
      });
  });
});

//Each authenticated user can read and write their own data
router.route('/')
  .all(session.checkSession)

  .get(function (req, res, next) {
    Model.findOne({ _id: req.user._id }, function (err, user) {
      if (err) return next(err);
      res.json(user);
    });
  })

  .put(function (req, res, next) {
    //Only allow updating a subset of fields
    const allowed = [ 'firstName', 'lastName' ];
    const update = {};
    allowed.map((field) => {
      if (typeof req.body[field] !== 'undefined') {
        update[field] = req.body[field];
      }
    });
    Model.findByIdAndUpdate(req.user._id, { $set: update }, { new: true }, function (err, user) {
      if (err) return next(err);
      if (user) {
        res.json(returnUser(user));
      } else {
        next(new Error('User not found, please log in an try again'));
      }
    });
  });

module.exports = router;
