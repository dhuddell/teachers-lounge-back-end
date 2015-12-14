var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/project');


router.route('/').
  get(ctrl.showProjects).
  post(ctrl.createProject);

router.route('/:id').
  get(ctrl.showProject).
  delete(ctrl.destroyProject).
  patch(ctrl.updateProject);

module.exports = router;
