const Order = require("../models/Order");

exports.createOrder = (req, res, next) => {
  try {
    const reqData = req.body;
    // console.log("reqData:", reqData);
    const newOrder = new Order({
      userId: reqData.userId,
      products: reqData.products,
      totalPrice: reqData.totalPrice,
    });
    newOrder.save();
  } catch (error) {
    return next(new Error(error));
  }
};
