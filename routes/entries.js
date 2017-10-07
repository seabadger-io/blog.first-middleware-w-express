const express = require('express');
const router = express.Router();
const Model = require('../models/entry');
const session = require('./shared/session');

router.route('/')

  //Return all entries, this doesn't require authentication
  .get(function (req, res, next) {
    Model.find({})
      .populate('author', 'email displayName')
      .exec(function (err, entries) {
        if (err) return next(err);
        res.json(entries);
      });
  })

  //To post a new entry, must be logged in
  .all(session.checkSession)

  //Save a new entry
  .post(function (req, res, next) {
    const entry = {
      title: req.body.title,
      content: req.body.content,
      author: req.user._id
    };
    Model.create(entry, function (err, entry) {
      if (err) return next(err);
      res.json({
        'id': entry._id
      });
    });
  });

router.route('/:entryId')
  //Return one entry identified by request parameter (no auth)
  .get(function (req, res, next) {
    Model.findById(req.params.entryId)
      .populate('author', 'email displayName')
      .exec(function (err, entry) {
        if (err) return next(err);
        if (entry) {
          res.json(entry);
        } else {
          next();
        }
      });
  })

  //Must be logged in to perform update and delete operations
  .all(session.checkSession)

  //Update an existing entry
  .put(function (req, res, next) {
    var condition = { _id: req.params.entryId };
    //Limit update capability of non-admins to own entries
    if (!req.user.admin) {
      condition['author'] = req.user._id;
    }
    const entry = {
      title: req.body.title,
      content: req.body.content
    };
    Model.findOneAndUpdate(condition, {
      $set: entry
    }, {
      new: true
    }, function (err, entry) {
      if (err) return next(err);
      if (entry) {
        res.json(entry);
      } else {
        next();
      }
    });
  })

  //Delete an existing entry
  .delete(function (req, res, next) {
    var condition = { _id: req.params.entryId };
    //Limit delete capability of non-admins to own entries
    if (!req.user.admin) {
      condition['author'] = req.user._id;
    }
    Model.findOneAndRemove(condition, function (err, resp) {
      if (err) return next(err);
      if (resp) {
        res.json(resp);
      } else {
        next();
      }
    });
  });

module.exports = router;
