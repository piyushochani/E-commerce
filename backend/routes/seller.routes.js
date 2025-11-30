const express = require('express');
const router = express.Router();
const sellerController = require('../controller/seller.controller');
const { authenticateSeller } = require('../middleware/auth.middleware');
const { validateSellerRegistration, validateSellerLogin } = require('../middleware/validation.middleware');

// Registration with OTP (3-step process: email verification → admin approval → complete)
router.post('/request-email-otp', sellerController.requestEmailVerificationOTP);
router.post('/verify-email-otp', sellerController.verifyEmailAndRequestAdminOTP);
router.post('/verify-admin-otp-register', validateSellerRegistration, sellerController.verifyAdminOTPAndRegister);

// Login
router.post('/login', validateSellerLogin, sellerController.loginSeller);

// Forgot Password (2-step process)
router.post('/forgot-password', sellerController.requestForgotPasswordOTP);
router.post('/reset-password', sellerController.resetPassword);

// Public routes
router.get('/', sellerController.getAllSellers);

// Protected routes
router.get('/profile', authenticateSeller, sellerController.getSellerProfile);
router.put('/profile', authenticateSeller, sellerController.updateSellerProfile);
router.delete('/profile', authenticateSeller, sellerController.deleteSeller);

module.exports = router;