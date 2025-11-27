const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const { authenticateSeller } = require('../middleware/auth.middleware');
const { validateProductCreation } = require('../middleware/validation.middleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes - NO UPLOAD MIDDLEWARE FOR NOW
router.post('/', authenticateSeller, productController.createProduct);
router.put('/:id', authenticateSeller, productController.updateProduct);
router.delete('/:id', authenticateSeller, productController.deleteProduct);
router.get('/seller/my-products', authenticateSeller, productController.getProductsBySeller);

module.exports = router;