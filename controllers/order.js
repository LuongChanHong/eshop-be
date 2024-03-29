const nodemailer = require("nodemailer");
const mailgen = require("mailgen");

const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const { default: mongoose } = require("mongoose");

const handleMailContent = (data, sendTime) => {
  const _sendTime =
    sendTime.getHours() +
    ":" +
    sendTime.getMinutes() +
    " " +
    sendTime.getDate() +
    "/" +
    parseInt(sendTime.getMonth() + 1) +
    "/" +
    sendTime.getFullYear();

  let mailContent = {
    body: {
      name: `${data.user.fullname}`,
      intro: `Order time: ${_sendTime}`,
      table: {
        data: data.products.map((item) => {
          return {
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          };
        }),
      },
      outro: `Total: ${data.totalPrice} VND`,
    },
  };
  return mailContent;
};

const sendMail = async (data, sendTime) => {
  const tranport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hongmainmail@gmail.com",
      pass: "fmxdsfegsrbigufu",
    },
  });

  const mailGenarator = new mailgen({
    theme: "default",
    product: { name: "E SHOP", link: "https://mailgen.js/" },
  });
  const mailContent = handleMailContent(data, sendTime);
  const mail = mailGenarator.generate(mailContent);
  tranport
    .sendMail({
      from: "hongmainmail@gmail.com",
      to: data.user.email,
      subject: "Order",
      html: mail,
    })
    .then(() => {
      console.log("SENDED MAIL");
    })
    .catch((err) => {
      console.log("err:", err);
    });
};

exports.createOrder = async (req, res, next) => {
  console.log("===== CREATTING ORDER");
  try {
    const reqData = req.body;
    // console.log("reqData.user:", reqData.user);
    await User.findByIdAndUpdate(reqData.user.userId, reqData.user);
    const newOrder = new Order({
      user: reqData.user,
      products: reqData.products,
      totalPrice: reqData.totalPrice,
    });
    await sendMail(req.body, newOrder.orderTime);
    newOrder.save();

    await Cart.findOneAndUpdate({ userId: reqData.user.userId }, { items: [] });
    res.end();
  } catch (error) {
    return next(new Error(error));
  }
};

exports.getAllOrder = async (req, res, next) => {
  console.log("===== GETTING ALL ORDER");

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
  console.log("===== GETTING ORDER BY USER ID");

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
