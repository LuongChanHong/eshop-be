const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: { type: String, require: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email address"],
  },
  phone: { type: String, require: true },
  address: { type: String, require: true },
});

module.exports = mongoose.model("User", userSchema);
