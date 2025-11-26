const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.controller");
const auth = require("../middleware/auth.middleware");

// Protected (customer only)
router.get("/", auth, cartController.getCart);
router.post("/add", auth, cartController.addItemToCart);
router.post("/remove", auth, cartController.removeItemFromCart);
router.post("/clear", auth, cartController.clearCart);

module.exports = router;
