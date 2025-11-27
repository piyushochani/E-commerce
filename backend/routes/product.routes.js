const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const { authenticateSeller } = require('../middleware/auth.middleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes with OTP
router.post('/request-creation-otp', authenticateSeller, productController.requestProductCreationOTP);
router.post('/verify-otp-create', authenticateSeller, productController.verifyOTPAndCreateProduct);
router.put('/:id', authenticateSeller, productController.updateProduct);
router.delete('/:id', authenticateSeller, productController.deleteProduct);
router.get('/seller/my-products', authenticateSeller, productController.getProductsBySeller);

module.exports = router;
