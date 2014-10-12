var expect = require('chai').expect,
    expressDblogger = require('..');

describe('express-dblogger', function() {
  it('should say hello', function(done) {
    expect(expressDblogger()).to.equal('Hello, world');
    done();
  });
});
