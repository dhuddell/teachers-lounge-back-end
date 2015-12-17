var express = require('express');
var router = express.Router();
var controller = require('../controllers/projects');

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.route('/').
  get(controller.index).
  post(upload.single('file'), controller.create);

router.route('/:id').
  get(controller.show).
  delete(controller.destroy).
  patch(upload.single('file'), controller.update);

module.exports = router;
