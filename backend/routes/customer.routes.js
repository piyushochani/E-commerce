const express = require("express");
const router = express.Router();
const customerController = require("../controller/customer.controller");
const auth = require("../middleware/auth.middleware");

// Public routes
router.post("/register", customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);

// Protected routes
router.get("/profile", auth, customerController.getCustomerProfile);
router.put("/profile", auth, customerController.updateCustomerProfile);
router.delete("/delete", auth, customerController.deleteCustomer);

module.exports = router;
