const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const { authenticateCustomer } = require('../middleware/auth.middleware');
const { validatePlaceOrder } = require('../middleware/validation.middleware');

router.post('/place', authenticateCustomer, validatePlaceOrder, orderController.placeOrder);
router.get('/', authenticateCustomer, orderController.getCustomerOrders);
router.get('/:id', authenticateCustomer, orderController.getOrderById);
router.put('/:id/status', authenticateCustomer, orderController.updateOrderStatus);
router.put('/:id/cancel', authenticateCustomer, orderController.cancelOrder);

module.exports = router;