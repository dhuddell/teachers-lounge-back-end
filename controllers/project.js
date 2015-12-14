'use strict';

var mongoose = require('mongoose');
mongoose.Promise = Promise;


var User = require('../models').model('User');
var Project = require('../models').model('Project');

var ctrl = {

    root : {
        get : function(req, res) {
            res.json(req.session);
        },
        'default' : function(err, req, res) {
            res.status(500).
                json({
                    error : {
                        name : err.name,
                        message : err.message
                    }
                });
        },
        middleware : [
            function(req, res, next) {
                if(req.session) {
                    if(req.session.currRequestRoute) {
                        req.session.lastRequestRoute = req.session.currRequestRoute;
                    }

                    req.session.currRequestRoute = req.path;
                }

                next();
            }
        ]
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
                name : req.body.title,
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


    updateItem : function(req, res, next) {
        // check that user is logged in
        // check that body contains a password value
        if(!req.body || !req.user || !req.body.name && !req.body.city) {
            var err = new Error("No update supplied.");
            return next(err);
        }
        var pUpdate = new Promise(function(resolve, reject) {
            ListItem.findByIdAndUpdate(
                req.params.id,
                {
                name : req.body.name,
                city : req.body.city
                }, {new: true},
                function(err, listItem){
                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve(listItem);
                }
            );
        });

        pUpdate.then(function(listItem){
          req.user.save();
          return listItem;
        }).then(function(listItem) {
            res.json(listItem);
        }).catch(function(err) {
            next(err);
        });
    },

    destroyItem : function(req, res, next) {
        User.findByIdAndUpdate( req.user._id,{
            $pullAll : { list: [ new mongoose.Types.ObjectId(req.params.id) ] }
        },
        {new: true}).exec().then(function(){
            console.log('item id is ', req.params.id);
            return ListItem.findByIdAndRemove(req.params.id).exec();
        }).then(function(){
            res.sendStatus(200);
        }).catch(function(err){
            console.log(err);
            next(err);
        }) ;
    }

};

module.exports = ctrl;
