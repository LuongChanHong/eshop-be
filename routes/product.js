const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");

router.get("/getAllProducts", productController.getAllProduct);
router.get("/getProductDetail", productController.getProductDetail);

module.exports = router;
