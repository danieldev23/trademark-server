const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
    // required: true,
  }
});

const Bank = mongoose.model("Bank", bankSchema);
module.exports = Bank;
