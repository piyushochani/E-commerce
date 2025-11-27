const express = require('express');
const router = express.Router();
const sellerController = require('../controller/seller.controller');
const { authenticateSeller } = require('../middleware/auth.middleware');
const { validateSellerRegistration } = require('../middleware/validation.middleware');

// Public routes
router.post('/register', validateSellerRegistration, sellerController.registerSeller);
router.get('/', sellerController.getAllSellers);

// Protected routes
router.get('/profile', authenticateSeller, sellerController.getSellerProfile);
router.put('/profile', authenticateSeller, sellerController.updateSellerProfile);
router.delete('/profile', authenticateSeller, sellerController.deleteSeller);

module.exports = router;