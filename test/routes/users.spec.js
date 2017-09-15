const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

var mockUser = { _id: '507f1f77bcf86cd799439011', email: 'test@email.moc', displayName: 'Test Name' };
var mockEntry = { _id: '507f1f77bcf86cd799439012', title: 'Test Title', author: '507f1f77bcf86cd799439011' };

var initMockApp = function (userResponse, entryResponse) {
  var app = express();
  //dummy models to run the Mongoose callbacks
  var userModel = {
    findByIdAndRemove: function (id, cb) {
      cb(userResponse.err, userResponse.res);
    }
  };
  var entryModel = {
    findOne: function (req, cb) {
      cb(entryResponse.err, entryResponse.res);
    }
  };
  //proxy models when loading the router
  var router = proxyquire('../../routes/users',
      { '../models/user': userModel,
        '../models/entry': entryModel });
  app.use('/users',router);
  //define error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  });
  return app;
};

describe('User delete /:userId', function () {
  it('fails if user owns entry', function (done) {
    var app = initMockApp({err: null, res: mockUser}, 
        {err: null, res: mockEntry });
    request(app)
      .delete('/users/' + mockUser._id)
      .expect(function (res) {
        expect(res.body.message).to.equal('This user owns entries, remove the entries first');
      })
      .expect(412, done);
  });
});
