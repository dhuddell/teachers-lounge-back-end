'use strict';

var mongoose = require('mongoose');
mongoose.Promise = Promise;


var User = require('../models').model('User');
var Project = require('../models').model('Project');
var awsUpload = require('../lib/aws-upload.js');


var controller = {


    //DISPLAY ALL PROJECTS **FOR SEARCH**
    index : function(req, res, next) {
        console.log(req.query);
        console.log(req.user);

        if(!req.user || !req.user.hasSubmitted) {
            var err = new Error("No projects submitted!");
            return next(err);
        }
        var query = {userId: req.user._id};
        if (Object.keys(req.query).length) {
            var keys = Object.keys(req.query);
            query = keys.reduce(function(memo, key) {
                memo[key] = new RegExp(req.query[key], 'gim');
                return memo;
            }, {});
        }
        Project.find(query).exec().then(function(projects){
            res.json(projects);
        }).catch(function(err){
            next(err);
        });
    },


//UPDATED createProject

    create : function(req, res, next) {
        if(!req.body || !req.user || !req.body.title) {
            var err = new Error("No content!");
            return next(err);
        }
        awsUpload(req.file.buffer).then(function(data){
            return Project.create({
                title : req.body.title,
                description : req.body.description,
                subject: req.body.subject,
                grade: req.body.grade,
                userId: req.user._id,
                url: data.Location
            });
        }).then(function(project) {
            return User.findByIdAndUpdate(
                req.user._id,{
                    hasSubmitted: true
                }).exec().then(function(){
                    return project;
                });
        }).then(function(project) {
            res.json(project);
        }).catch(function(err) {
            next(err);
        });
    },

    show : function(req, res, next) {
        if( !req.user) {
            var err = new Error("Unauthorized.");
            return next(err);
        }
        Project.findById(req.params.id).exec().then(function(project){
            res.json(project);
        }).catch(function(err){
            next(err);
        });
    },

//UPDATED TO projects

    update : function(req, res, next) {
        // check that user is logged in
        // check that body contains a password value
        if(!req.body || !req.user) {
            var err = new Error("No update supplied.");
            return next(err);
        }

        awsUpload(req.file.buffer).then(function(data){
            return Project.findByIdAndUpdate(
              req.params.id,
              {
                title : req.body.title,
                description : req.body.description,
                subject: req.body.subject,
                grade: req.body.grade,
                url: data.Location
              },
              {new: true, key: data.Location});
          }).then(function(project) {
              res.json(project);
          }).catch(function(err) {
              next(err);
          });
    },



    destroy : function(req, res, next) {
         Project.findByIdAndRemove(req.params.id).exec().then(function(project){
            res.json(project);
        }).catch(function(err){
            console.log(err);
            next(err);
        }) ;
    }

};

module.exports = controller;
