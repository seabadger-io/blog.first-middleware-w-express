const express = require('express');
const router = express.Router();
const Model = require('../models/entry');

router.route('/')
  //Return all entries
  .get(function (req, res, next) {
    Model.find({})
      .populate('author', 'email displayName')
      .exec(function (err, entries) {
        if (err) return next(err);
        res.json(entries);
      });
  })

  //Save a new entry
  .post(function (req, res, next) {
    Model.create(req.body, function (err, entry) {
      if (err) return next(err);
      res.json({
        'id': entry._id
      });
    });
  });

router.route('/:entryId')
  //Return one entry identified by request parameter
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

  //Update an existing entry
  .put(function (req, res, next) {
    Model.findByIdAndUpdate(req.params.entryId, {
      $set: req.body
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
    Model.findByIdAndRemove(req.params.entryId, function (err, resp) {
      if (err) return next(err);
      res.json(resp);
    });
  });

module.exports = router;
