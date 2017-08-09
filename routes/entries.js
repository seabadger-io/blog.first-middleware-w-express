var express = require('express');
var router = express.Router();
var Entries = require('./entries.json');

router.route('/')
  //Return all entries
  .get(function (req, res, next) {
    res.json(Entries);
  });

router.route('/:entryId')
  //Return one entry identified by request parameter
  .get(function (req, res, next) {
    var entry = Entries.find(function (entry) {
      return entry.id == req.params.entryId;
    });
    if (entry){
      res.json(entry);
    }else{
      res.json({ error: "Entry not found"});
    }
  });

module.exports = router;
