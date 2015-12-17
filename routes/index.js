var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');


/* GET home page. */
router.get('/', authController.root.get);

/**AUTH ROUTES
 *	a login route using `passport.authenticate`
 *	a register route **not using passport**
 *
 */
router.route('/login').
    get(authController.deny).
    post(authController.login.post).
    all(authController.login.all);

router.route('/logout').
	all(authController.logout.all);

router.route('/changePassword').
	get(authController.deny).
	patch(authController.changePassword.patch);

router.route('/signup').
	get(authController.deny).
	post(authController.signup.post);


module.exports = router;
