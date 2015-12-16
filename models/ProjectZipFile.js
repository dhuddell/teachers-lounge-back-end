'use strict';

var mongoose = require('mongoose');
// var UserId = mongoose.Schema.Types.ObjectId;
var projectZipFileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  // user_id: {
  //   type: UserId,
  //   ref: "User"
  // },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var ProjectZipFile = mongoose.model('ProjectZipFile', projectZipFileSchema);

module.exports = ProjectZipFile;
