const expect = require('chai').expect;
const Entry = require('../../models/entry');

describe('Entry', function () {
  it('should be invalid without title', function (done) {
    var entry = new Entry();
    entry.validate(function (err) {
      expect(err.errors.title).to.exist;
      done();
    });
  });
  it('should be invalid without author', function (done) {
    var entry = new Entry();
    entry.validate(function (err) {
      expect(err.errors.author).to.exist;
      done();
    });
  });
  it('validation returns no error for valid object', function (done) {
    var entry = new Entry({
      title: "Testing with mocha",
      author: "587a1f77ed2399a2792e9012"
    });
    entry.validate(function (err) {
      expect(err).to.be.null;
      done();
    });
  });
});
