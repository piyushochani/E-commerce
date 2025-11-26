const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const auth = require("../middleware/auth.middleware");

// Seller/Admin only (optional: add role middleware)
router.post("/add", auth, productController.addProduct);
router.put("/update/:id", auth, productController.updateProduct);
router.delete("/delete/:id", auth, productController.deleteProduct);

// Public
router.get("/all", productController.getAllProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
