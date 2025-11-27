const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart.controller');
const { authenticateCustomer } = require('../middleware/auth.middleware');
const { validateAddToCart } = require('../middleware/validation.middleware');

router.get('/', authenticateCustomer, cartController.getCart);
router.post('/add', authenticateCustomer, validateAddToCart, cartController.addToCart);
router.put('/update', authenticateCustomer, cartController.updateCartItem);
router.put('/update/:cart_item_id', authenticateCustomer, cartController.updateCartItem);
router.delete('/remove/:cart_item_id', authenticateCustomer, cartController.removeFromCart);
router.delete('/clear', authenticateCustomer, cartController.clearCart);

module.exports = router;