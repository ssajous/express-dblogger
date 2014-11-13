'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LogEntrySchema = new Schema({
  req: {
    url: String,
    method: String,
    headers: [],
    ipAddress: String
  },
  res: {
    status: String,
    headers: []
  },
  responseTime: String,
  date: String
});

module.exports = mongoose.model('LogEntry', LogEntrySchema);