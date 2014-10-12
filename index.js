'use strict';

var onFinished = require('on-finished');
var LogEntry = require('./lib/logEntry.model');

function logger(req, res, next) {
  req._startAt = process.hrtime();
  req._startTime = new Date;
  req._remoteAddress = getip(req);

  function logRequest(){
    if (skip(req, res)) return;
    var line = fmt(exports, req, res);
    if (null == line) return;
    stream.write(line + '\n');
  };

  // immediate
  if (immediate) {
    logRequest();
  } else {
    onFinished(res, logRequest)
  }

  next();
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

module.exports = function () {
  return 'Hello, world';
};
