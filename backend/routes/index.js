const express = require('express');
const router = express.Router();

const customerRoutes = require('./customer.routes');
const cartRoutes = require('./cart.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const sellerRoutes = require('./seller.routes');

// Mount all routes
router.use('/customers', customerRoutes);
router.use('/cart', cartRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/sellers', sellerRoutes);

module.exports = router;