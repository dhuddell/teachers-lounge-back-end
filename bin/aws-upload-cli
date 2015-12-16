#!/usr/bin/env node

'use strict';

var db = require('../lib/db');

var fs = require('fs');

var buffer = fs.readFileSync(process.argv[2]);
var caption = process.argv[3];

var awsUpload = require('../lib/aws-upload.js');

awsUpload(buffer, caption).then(function(data) {
  console.log(data);
}).catch(function(error) {
  console.error(error);
}).then(function() {
  db.close();
});
