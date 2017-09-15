const express = require('express');
const router = express.Router();
const Model = require('../models/user');
const entryModel = require('../models/entry');

router.route('/')
  //Return all users
  .get(function (req, res, next) {
    Model.find({}, function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  })

  //Save a new user
  .post(function (req, res, next) {
    Model.create(req.body, function (err, user) {
      if (err) return next(err);
      res.json({
        'id': user._id
      });
    });
  });

router.route('/:userId')
  //Return one user identified by request parameter
  .get(function (req, res, next) {
    Model.findById(req.params.userId, function (err, user) {
      if (err) return next(err);
      if (user) {
        res.json(user);
      } else {
        next();
      }
    });
  })

  //Update an existing user
  .put(function (req, res, next) {
    Model.findByIdAndUpdate(req.params.userId, {
      $set: req.body
    }, {
      new: true
    }, function (err, user) {
      if (err) return next(err);
      if (user) {
        res.json(user);
      } else {
        next();
      }
    });
  })

  //Delete an existing user
  .delete(function (req, res, next) {
    //Only allow deleting user without an entry
    entryModel.findOne({
      author: req.params.userId
    }, function (err, resp) {
      if (err) return next(err);
      if (resp !== null) {
        err = new Error("This user owns entries, remove the entries first");
        err.status = 412; //precondition failed
        return next(err);
      }
      Model.findByIdAndRemove(req.params.userId, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
      });
    });
  });

module.exports = router;
