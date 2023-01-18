const express = require("express");

const productController = require("../controller/product");

const router = express.Router();

router.get("/", productController.getProducts);

router.post("/", productController.postProduct);

router.patch("/:productId", productController.updateProduct);

router.delete("/:productId", productController.deletProduct);

module.exports = router;