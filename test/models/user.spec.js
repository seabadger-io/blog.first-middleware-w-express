const expect = require('chai').expect;
const User = require('../../models/user');

describe('User', function () {
  it('should be invalid without email', function (done) {
    var user = new User();
    user.validate(function (err) {
      expect(err.errors.email).to.exist;
      done();
    });
  });
  it('should be invalid without displayName', function (done) {
    var user = new User();
    user.validate(function (err) {
      expect(err.errors.displayName).to.exist;
      done();
    });
  });
  it('validation returns no error for valid object', function (done) {
    var user = new User({ 
			email: "dummy@a.cc", 
			displayName: "dummy"
    });
    user.validate(function (err) {
      expect(err).to.be.null;
      done();
    });
  });
  it('sets default value of firstName and lastName when not defined', function (done) {
    var user = new User({ 
			email: "dummy@a.cc", 
			displayName: "dummy"
    });
    expect(user.firstName).to.equal('');
    expect(user.lastName).to.equal('');
    done();
  });
  context('fullName', function () {
    it('should be "firstName lastName"', function (done) {
      var user = new User({ 
		  	email: "dummy@a.cc", 
		  	displayName: "dummy", 
        firstName: "fn", 
        lastName: "ln" 
      });
      expect(user.fullName()).to.be.equal("fn ln");
      done();
    });
  });
});
