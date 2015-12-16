'use strict';

var mongoose = require('mongoose');
mongoose.Promise = Promise;


var User = require('../models').model('User');
var Project = require('../models').model('Project');

var ctrl = {


    //DISPLAY ALL PROJECTS **FOR SEARCH**
    searchProjects : function(req, res, next) {
        console.log(req.query);
        console.log(req.user);
        var query = req.query || {user_id: req.user._id};
        if(!req.user || !req.user.hasSubmitted) {
            var err = new Error("Not submitted-level user!");
            return next(err);
        }

        Project.find(query).exec().then(function(projects){
            res.json(projects);
        }).catch(function(err){
            next(err);
        });
    },

//UPDATED showProjects

    showProjects : function(req, res, next) {
        if(!req.user) {
            var err = new Error("Not Authorized!");
            return next(err);
        }

        User.findById(req.user._id).populate('projects').exec().then(function(user){
            res.json(user.projects);
        }).catch(function(err){
            next(err);
        });



    },

//UPDATED createProject

    createProject : function(req, res, next) {
        if(!req.body || !req.user || !req.body.title) {
            var err = new Error("No content!");
            return next(err);
        }

        var pProject = new Promise(function(resolve, reject) {
            Project.create({
                    title : req.body.title,
                    description : req.body.description,
                    subject: req.body.subject,
                    grade: req.body.grade
                }, function(err, project) {
                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve(project);
                }
            );
        });

        pProject.then(function(project){
          req.user.projects.push(project);
          req.user.save();
          return project;
        }).then(function(project) {
            res.json(project);
        }).catch(function(err) {
            next(err);
        });
    },

    showProject : function(req, res, next) {
        // check that user is logged in
        // check that body contains a password value
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

    updateProject : function(req, res, next) {
        // check that user is logged in
        // check that body contains a password value
        if(!req.body || !req.user) {
            var err = new Error("No update supplied.");
            return next(err);
        }
        var pUpdate = new Promise(function(resolve, reject) {
            Project.findByIdAndUpdate(
                req.params.id,
                {
                    title : req.body.title,
                    description : req.body.description,
                    subject: req.body.subject,
                    grade: req.body.grade
                }, {new: true},
                function(err, project){
                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve(project);
                }
            );
        });

        pUpdate.then(function(project){
          return project;
        }).then(function(project) {
            res.json(project);
        }).catch(function(err) {
            next(err);
        });
    },



    destroyProject : function(req, res, next) {
        User.findByIdAndUpdate( req.user._id,{
            $pullAll : { projects: [ new mongoose.Types.ObjectId(req.params.id) ] }
          },
          {
            new: true
        }).exec().then(function(user){
            return Project.findByIdAndRemove(req.params.id).exec().then(function(){
                return user;
            });
        }).then(function(user){
            res.json(user);
        }).catch(function(err){
            console.log(err);
            next(err);
        }) ;
    }

};

module.exports = ctrl;
