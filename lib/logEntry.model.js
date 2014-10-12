'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var logEntrySchema = new Schema({
  req: {},
  res: {},
  responseTime: Number
});
