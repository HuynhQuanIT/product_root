const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.get('/register', auth.registerForm);
router.post('/register', auth.register);

router.get('/login', auth.loginForm);
router.post('/login', auth.login);

router.post('/logout', auth.logout);

// forgot / reset
router.get('/forgot', auth.forgotForm);
router.post('/forgot', auth.forgot);
router.get('/reset/:token', auth.resetForm);
router.post('/reset/:token', auth.reset);

module.exports = router;