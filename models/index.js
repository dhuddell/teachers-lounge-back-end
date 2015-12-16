'use strict';

var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.model('User', require('./User'));
mongoose.model('Project', require('./Project'));
mongoose.model('ProjectZipFile', require('./ProjectZipFile'));


mongoose.connect("mongodb://localhost/teachers-lounge");

module.exports = mongoose;
