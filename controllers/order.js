const nodemailer = require("nodemailer");
const mailgen = require("mailgen");

const Order = require("../models/Order");
const User = require("../models/User");

const _sendMail = () => {
  const config = {
    service: "gmail",
    auth: {
      user: "hongmainmail@gmail.com",
      pass: "fmxdsfegsrbigufu",
    },
  };
  const tranport = nodemailer.createTransport(config);
  const mailGenarator = new mailgen({
    theme: "default",
    product: { name: "Mailgen", link: "https://mailgen.js/" },
  });
  const response = {
    body: {
      name: "",
      intro: "You buying something",
      table: {
        data: [
          { item: "something", description: "some text", price: "some cash" },
        ],
      },
      outro: "what is this, we dont know",
    },
  };

  const mail = mailGenarator.generate(response);
  const mess = {
    from: "hongmainmail@gmail.com",
    to: "changcan82@gmail.com",
    subject: "Order",
    html: mail,
  };
  tranport
    .sendMail(mess)
    .then(() => {
      console.log("SENDED MAIL");
    })
    .catch((err) => {
      console.log("err:", err);
    });
};

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
