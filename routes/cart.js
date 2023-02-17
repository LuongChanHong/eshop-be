const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");

router.post("/add-item", cartController.addToCart);
router.get("/get-by-user-id", cartController.getByUserId);
router.post("/update-quantity", cartController.updateItemQuantity);

module.exports = router;
