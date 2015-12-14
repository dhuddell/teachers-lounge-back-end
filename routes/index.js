var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/auth');

/* GET home page. */
router.get('/', authCtrl.root.get);

/**AUTH ROUTES
 *	a login route using `passport.authenticate`
 *	a register route **not using passport**
 *
 */
router.route('/login').
	get(authCtrl.deny).
	post(authCtrl.login.post);

router.route('/logout').
	all(authCtrl.logout.all);

router.route('/changePassword').
	get(authCtrl.deny).
	patch(authCtrl.changePassword.patch);

router.route('/signup').
	get(authCtrl.deny).
	post(authCtrl.signup.post);


router.route('/projects').
  get(ctrl.showProjects).
  post(ctrl.createProject);

router.route('/projects/:id').
  get(ctrl.showProject).
  delete(ctrl.destroyProject).
  patch(ctrl.updateProject);


module.exports = router;
