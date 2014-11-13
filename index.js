'use strict';

var onFinished = require('on-finished');
var LogEntry = require('./lib/logEntry.model');

exports = module.exports = function (options) {

  console.log('Creating logger');
  console.log(options);

  options = options || {};


  // output on request instead of response
  var immediate = options.immediate;

  // check if log entry should be skipped
  var skip = options.skip || function () {
    return false;
  };

  var callback = options.callback || function () { return; };

  return function logger(req, res, next) {
    req._startAt = process.hrtime();
    req._startTime = new Date;
    req._remoteAddress = getip(req);

    function logRequest() {

      console.log('Logging Request');

      if (skip(req, res)) return;

      var logReq = {
        url: req.originalUrl || req.url,
        method: req.method,
        headers: req.headers,
        ipAddress: req._remoteAddress
      };

      var logRes = {
        status: res._header ? res.statusCode : null,
        headers: res.headers
      };

      var entry = {
        req: logReq,
        res: logRes,
        responseTime: responseTime(req, res),
        date: new Date().toUTCString()
      };

      console.log('Creating entry');
      console.log(entry);
      LogEntry.create(entry, function(error, logEntry) {
        console.log('Entry Callback');
        if (error) {
          console.log(error);
        }
        callback(error, logEntry);
      });
    };

    // immediate
    if (immediate) {
      logRequest();
    } else {
      onFinished(res, logRequest)
    }

    next();
  };
};


function responseTime(req, res) {
  if (!res._header || !req._startAt) return null;
  var diff = process.hrtime(req._startAt);
  var ms = diff[0] * 1e3 + diff[1] * 1e-6;

  return ms.toFixed(3);
}

/**
 * Get request IP address.
 *
 * @private
 * @param {IncomingMessage} req
 * @return {string}
 */

function getip(req) {
  return req.ip
    || req._remoteAddress
    || (req.connection && req.connection.remoteAddress)
    || undefined;
}