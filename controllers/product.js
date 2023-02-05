const Product = require("../models/Product");

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    return next(new Error(error));
  }
};
