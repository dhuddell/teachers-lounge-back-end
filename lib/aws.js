'use strict';

var bucket = process.env.AWS_S3_BUCKET ||
 require('dotenv').load() && process.env.AWS_S3_BUCKET;
var util = require('util');
var crypto = require('crypto');
var fs = require('fs');
var AWS = require('aws-sdk');
var getFileType = require('file-type');


var awsS3 = new AWS.S3();
var aws = {
  upload : function(buffer, options) {
    var fileType = getFileType(buffer);

    if (!fileType) {
      fileType = {
        ext: 'bin',
        mime: 'application/octet-stream'
      };
    }
    var key;
    if(options){
      key = options.key;
    } else{
      key = util.format('%s/%s.%s',
      (new Date()).toISOString().split('T')[0],
      crypto.pseudoRandomBytes(16).toString('hex'),
      fileType.ext);
  }


    var params = {
      ACL: 'public-read',
      Bucket: bucket,
      Key: key,
      ContentType: fileType.mime,
      Body: buffer
    };

    return new Promise(function(resolve, reject) {
      awsS3.upload(params, function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },

  delete : function(options){

    var key = options.key;

    var params = {
      Bucket: bucket,
      Key: key
    };
    return new Promise(function(resolve, reject) {
      awsS3.deleteObject(params, function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
};
module.exports = aws;
