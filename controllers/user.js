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
