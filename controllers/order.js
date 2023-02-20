const Order = require("../models/Order");
const User = require("../models/User");

exports.createOrder = async (req, res, next) => {
  try {
    const reqData = req.body;
    // console.log("reqData:", reqData);
    await User.findByIdAndUpdate(reqData.userId, { address: reqData.address });

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
