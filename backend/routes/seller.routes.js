const express = require("express");
const router = express.Router();
const sellerController = require("../controller/seller.controller");
const auth = require("../middleware/auth.middleware");

// Seller auth
router.post("/register", sellerController.registerSeller);
router.post("/login", sellerController.loginSeller);

// Seller dashboard
router.get("/profile", auth, sellerController.getSellerProfile);

module.exports = router;
