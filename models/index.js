'use strict';

var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.model('User', require('./User'));
mongoose.model('Project', require('./Project'));

mongoose.connect(process.env.MONGOLAB_URI);
module.exports = mongoose;
