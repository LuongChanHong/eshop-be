const Order = require("../models/Order");
const User = require("../models/User");

exports.createOrder = async (req, res, next) => {
  try {
    const reqData = req.body;
    // console.log("reqData:", reqData);
    await User.findByIdAndUpdate(reqData.userId, { address: reqData.address });

    const newOrder = new Order({
      user: reqData.user,
      products: reqData.products,
      totalPrice: reqData.totalPrice,
    });
    newOrder.save();
  } catch (error) {
    return next(new Error(error));
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    const reqData = req.query;
    // console.log("reqData:", reqData);
    const foundOrders = await Order.find({ userId: reqData.userId });
    if (foundOrders) {
      res.json(foundOrders);
    }
  } catch (error) {
    return next(new Error(error));
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const reqData = req.query;
    // console.log("reqData:", reqData);
    const foundOrder = await Order.findById(reqData.id);
    if (foundOrder) {
      res.json(foundOrder);
    }
  } catch (error) {
    return next(new Error(error));
  }
};
