const express = require('express');
const router = express.Router();
const customerController = require('../controller/customer.controller');
const { authenticateCustomer } = require('../middleware/auth.middleware');
const { validateCustomerRegistration, validateCustomerLogin } = require('../middleware/validation.middleware');

// Registration with OTP (2-step process)
router.post('/request-registration-otp', customerController.requestRegistrationOTP);
router.post('/verify-otp-register', validateCustomerRegistration, customerController.verifyOTPAndRegister);

// Login
router.post('/login', validateCustomerLogin, customerController.loginCustomer);

// Forgot Password (2-step process)
router.post('/forgot-password', customerController.requestForgotPasswordOTP);
router.post('/reset-password', customerController.resetPassword);

// Protected routes
router.get('/profile', authenticateCustomer, customerController.getCustomerProfile);
router.put('/profile', authenticateCustomer, customerController.updateCustomerProfile);
router.delete('/profile', authenticateCustomer, customerController.deleteCustomer);

module.exports = router;