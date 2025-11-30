const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const { authenticateAdmin } = require('../middleware/admin.middleware');

// Admin Login (no registration - hardcoded credentials)
router.post('/login', adminController.adminLogin);

// Protected Admin Routes
router.get('/dashboard', authenticateAdmin, adminController.getDashboardStats);
router.get('/customers', authenticateAdmin, adminController.getAllCustomers);
router.get('/sellers', authenticateAdmin, adminController.getAllSellers);
router.get('/blocked-users', authenticateAdmin, adminController.getBlockedUsers);

// Blacklist/Unblock Customer
router.put('/blacklist-customer/:customer_id', authenticateAdmin, adminController.blacklistCustomer);
router.put('/unblock-customer/:customer_id', authenticateAdmin, adminController.unblockCustomer);

// Blacklist/Unblock Seller
router.put('/blacklist-seller/:seller_id', authenticateAdmin, adminController.blacklistSeller);
router.put('/unblock-seller/:seller_id', authenticateAdmin, adminController.unblockSeller);

module.exports = router;