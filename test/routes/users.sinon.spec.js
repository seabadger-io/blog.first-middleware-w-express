const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const express = require('express');

var userRoute = require('../../routes/users');
var User = require('../../models/user');
var Entry = require('../../models/entry');

var mockUser = { _id: '507f1f77bcf86cd799439011', email: 'test@email.moc', displayName: 'Test Name' };
var mockEntry = { _id: '507f1f77bcf86cd799439012', title: 'Test Title', author: '507f1f77bcf86cd799439011' };
var app = express()
app.use('/users', userRoute);
//define error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: err
  });
});

describe('User router ', function () {
  beforeEach(function () {
    sinon.stub(User, 'find');
    sinon.stub(User, 'findById');
  });
  afterEach(function () {
    User.find.restore();
    User.findById.restore();
  });
  it('returns user object array on GET /users', function (done) {
    var expectedResult = [ mockUser ];
    User.find.yields(null, expectedResult);
    request(app)
      .get('/users')
      .expect(function (res) {
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.include.keys('email','displayName');
      })
      .expect(200, done);
  });
});

describe('Delete user', function () {
  var userStub;
  var entryStub;
  beforeEach(function () {
    sinon.stub(User, 'findByIdAndRemove');
    sinon.stub(Entry, 'findOne');
  });
  afterEach(function () {
    User.findByIdAndRemove.restore();
    Entry.findOne.restore();
  });
  it('fails if user owns an entry', function (done) {
    Entry.findOne.yields(null, mockEntry);
    User.findByIdAndRemove.yields(null, null);
    request(app)
      .delete('/users/' + mockUser._id)
      .expect(function (res) {
        sinon.assert.notCalled(User.findByIdAndRemove);
        sinon.assert.calledOnce(Entry.findOne);
      })
      .expect(412, done);
  });
  it('is executed when user owns no entry', function (done) {
    Entry.findOne.yields(null, null);
    User.findByIdAndRemove.yields(null, {});
    request(app)
      .delete('/users/' + mockUser._id)
      .expect(function (res) {
        sinon.assert.calledOnce(Entry.findOne);
        sinon.assert.calledOnce(User.findByIdAndRemove);
      })
    .expect(200, done);
  });
});
