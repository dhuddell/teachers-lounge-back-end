'use strict';

var util = require('util');
var fs = require('fs');
var path = require('path');
var ProjectZipFile = require('../models/ProjectZipFile.js');

var crypto = require('crypto');
var getFileType = require('file-type');
//FIX ROUTE **********************************
var uploadBaseUrl = function (req) {
  return 'http://localhost:3000/project_zip_files';
};

var fileUpload = function(caption, buffer, callback) {
  var dirName = (new Date()).toISOString().split('T')[0];
  var fileType = getFileType(buffer);
  var fileExt = fileType ? fileType.ext : 'bin';
  var filename = util.format('%s.%s',
    crypto.pseudoRandomBytes(16).toString('hex'),
    fileExt);
  //FIX ROUTE **********************************
  var uploadDir = util.format('%s/%s',
    path.join(__dirname, '..', 'public', 'images'),
    dirName);
  var uploadFullPath = util.format('%s/%s',
    uploadDir, filename);
  var url = util.format('%s/%s/%s',
    uploadBaseUrl(), dirName, filename);

  fs.mkdir(uploadDir, function(err) {
    if (err && err.code !== 'EEXIST') {
      callback(err);
      return;
    }
    fs.writeFile(uploadFullPath, buffer, function(err) {
      if (err) {
        callback(err);
        return;
      }
      ProjectZipFile.create({
        caption: caption,
        url: url
      }, callback);
    });
  });
};

module.exports = fileUpload;
