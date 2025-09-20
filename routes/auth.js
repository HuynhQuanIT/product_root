const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { requireGuest } = require('../middleware/auth');

// Routes cho guests (chưa đăng nhập)
router.get('/register', requireGuest, AuthController.showRegister);
router.post('/register', requireGuest, AuthController.register);
router.get('/login', requireGuest, AuthController.showLogin);
router.post('/login', requireGuest, AuthController.login);
router.get('/forgot', requireGuest, AuthController.showForgotPassword);
router.post('/forgot', requireGuest, AuthController.forgotPassword);
router.get('/reset/:token', requireGuest, AuthController.showResetPassword);
router.post('/reset/:token', requireGuest, AuthController.resetPassword);

// Route đăng xuất (cho người đã đăng nhập)
router.post('/logout', AuthController.logout);

module.exports = router;