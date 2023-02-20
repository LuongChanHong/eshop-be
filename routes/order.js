const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");

router.post("/create", orderController.createOrder);
router.get("/get-all-order", orderController.getAllOrder);
router.get("/get-order-by-id", orderController.getOrderById);

module.exports = router;
