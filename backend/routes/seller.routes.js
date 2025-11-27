const express = require('express');
const router = express.Router();
const sellerController = require('../controller/seller.controller');
const { authenticateSeller } = require('../middleware/auth.middleware');
const { validateSellerRegistration, validateSellerLogin } = require('../middleware/validation.middleware');

// Registration with OTP (OTP sent to ochanipiyush07@gmail.com)
router.post('/request-otp', validateSellerRegistration, sellerController.requestSellerRegistrationOTP);
router.post('/verify-otp-register', validateSellerRegistration, sellerController.verifyOTPAndRegister);

// Login (No OTP - just email + password)
router.post('/login', validateSellerLogin, sellerController.loginSeller);

// Public routes
router.get('/', sellerController.getAllSellers);

// Protected routes
router.get('/profile', authenticateSeller, sellerController.getSellerProfile);
router.put('/profile', authenticateSeller, sellerController.updateSellerProfile);
router.delete('/profile', authenticateSeller, sellerController.deleteSeller);

module.exports = router;