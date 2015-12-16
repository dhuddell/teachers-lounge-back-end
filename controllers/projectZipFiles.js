'use strict';

var ProjectZipFile = require('../models/ProjectZipFile.js');
var awsUpload = require('../lib/aws-upload.js');


var index = function index(req, res, next) {
  ProjectZipFile.find({}, {__v: 0}).exec().then(function(zipFiles) {
    res.json(zipFiles);
  }).catch(function(error) {
    next(error);
  });
};

var create = function create(req, res, next) {
  awsUpload(req.file.buffer, {
    title: req.body.name,
    user_id: req.user._id
  }).then(function(data){
    req.user.userFiles.push(data._id);
    req.user.save();
    res.json(data);
  }).catch(function(err){
    next(err);
  });
};

module.exports = {
  index,
  create
};
