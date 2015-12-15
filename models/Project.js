'use script';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var projectSchema = new Schema({
  title : {
    type : String,
    required : true
  },
  description: {
    type : String,
    // required : true
  },
  subject: {
    type : String,
    // required : true
  },
  grade: {
    type : String,
    // required : true
  },
  url: {
    type : String,
    // required : true
  }
});

module.exports = projectSchema;

