var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.get);

router.get('/signup', indexController.signupFormGet);
router.post('/signup', indexController.validateSignup, indexController.signupFormPost);

router.get('/login', indexController.loginFormGet);
router.post('/login', indexController.loginFormPost);

router.get('/create-message', indexController.msgFormGet);
router.post('/create-message', indexController.validateMessage, indexController.msgFormPost);

router.get('/admin', indexController.adminGet);
// router.post('/admin', indexController.adminPost);

router.get('/logout', indexController.logoutGet);

module.exports = router;
