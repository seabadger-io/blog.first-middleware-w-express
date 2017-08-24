const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Model = require('../models/entry');

router.route('/')
  //Return all entries
  .get(function (req, res, next) {
    Model.find({}, function (err, entries) {
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
    Model.findById(req.params.entryId, function (err, entry) {
      if (err) return next(err);
      res.json(entry);
    });
  });

module.exports = router;
