const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.signup = async (req, res, next) => {
  try {
    const reqData = req.query;
    const valid = validationResult(req);
    const hashPass = await bcrypt.hash(reqData.password, 12);
    // console.log("reqData:", reqData);
    if (valid.errors.length > 0) {
      // console.log("valid:", valid);
      res.send(valid);
    } else {
      console.log("hashPass:", hashPass);
      const newUser = new User({
        email: reqData.email,
        fullname: reqData.fullname,
        phone: reqData.phone,
        password: hashPass,
      });
      newUser.save();
    }
    res.end();
  } catch (error) {
    return next(new Error(error));
  }
};

const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

exports.login = async (req, res, next) => {
  try {
    const reqData = req.body || req.query;
    // console.log(reqData);
    const valid = validationResult(req);
    // console.log("valid:", valid);
    if (valid.errors.length <= 0) {
      const foundUser = await User.findOne({ email: reqData.email }).select(
        "email password"
      );
      if (foundUser) {
        // console.log("foundUser:", foundUser);
        const isEqual = await comparePassword(
          reqData.password,
          foundUser.password
        );
        // console.log("isEqual:", isEqual);
        if (isEqual) {
          req.session.userId = foundUser._id;
          res.send(req.session);
        } else {
          res.json({ msg: "Password wrong" });
        }
      }
    } else {
      res.send({ msg: "Email wrong" });
    }
  } catch (error) {
    return next(new Error(error));
  }
};
