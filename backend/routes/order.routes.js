const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");
const auth = require("../middleware/auth.middleware");

// Customer
router.post("/place", auth, orderController.placeOrder);
router.get("/my-orders", auth, orderController.getCustomerOrders);

// Admin/Seller (optional)
router.get("/all", auth, orderController.getAllOrders);
router.put("/update-status/:id", auth, orderController.updateOrderStatus);

module.exports = router;
