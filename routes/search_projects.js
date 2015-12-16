var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/projects');


router.route('/').
  get(ctrl.searchProjects);

module.exports = router;
