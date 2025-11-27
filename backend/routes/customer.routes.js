const express = require('express');
const router = express.Router();
const customerController = require('../controller/customer.controller');
const { authenticateCustomer } = require('../middleware/auth.middleware');
const { validateCustomerRegistration, validateCustomerLogin } = require('../middleware/validation.middleware');

// Public routes with validation
router.post('/register', validateCustomerRegistration, customerController.registerCustomer);
router.post('/login', validateCustomerLogin, customerController.loginCustomer);

// Protected routes
router.get('/profile', authenticateCustomer, customerController.getCustomerProfile);
router.put('/profile', authenticateCustomer, customerController.updateCustomerProfile);
router.delete('/profile', authenticateCustomer, customerController.deleteCustomer);

module.exports = router;