var http = require('http'),
    request = require('supertest'),
    should = require('chai').should(),
    dbLogger = require('..'),
    mongoose = require('mongoose');

var LogEntry = require('../lib/logEntry.model');

//var mockgoose = require('mockgoose');

//mockgoose(mongoose);


mongoose.connect('mongodb://localhost/expressdblogger-test');

var lastEntry,
  lastError,
  options;

describe('express-dblogger', function() {

  before(function (done) {
    options = { callback: mapLastEntry };
    done();
  });

  beforeEach(function(done) {
    //mockgoose.reset();
    done();
  });

  it('should exist', function (done) {
    should.exist(dbLogger);
    done();
  });

  describe('logger', function () {

    it('should work', function(done) {
      LogEntry.create({
        req: {},
        res: {},
        responseTime: 7,
        date: new Date().toISOString()
      }, function(err, item) {
        console.log(err);
        console.log(item);

        done(err);
      });
    });
//
//    it('should get request headers', function (done) {
//      var server = createServer(options);
//
//      console.log('RUNNING test');
//
//      request(server)
//        .get('/')
//        .set('x-from-string', 'me')
//        .end(function (err, res) {
//          if (err) return done(err);
//          lastEntry.req.headers['x-from-string'].should.equal('me\n');
//          done();
//        });
//    });
  });

});


function createServer(opts, fn, fn1) {
  var logger = dbLogger(opts);
  var middle = fn || noopMiddleware;

  return http.createServer(function onRequest(req, res) {
    // prior alterations
    if (fn1) {
      fn1(req, res);
    }

    logger(req, res, function onNext(err) {
      // allow req, res alterations
      middle(req, res, function onDone() {
        if (err) {
          res.statusCode = 500;
          res.end(err.message);
        }

        res.setHeader('X-Sent', 'true');
        res.end((req.connection && req.connection.remoteAddress) || '-');
      });
    });
  });
}

function noopMiddleware(req, res, next) {
  next();
}

function mapLastEntry(error, entry) {
  console.log('mapping');
  lastError = error;
  lastEntry = entry;
}