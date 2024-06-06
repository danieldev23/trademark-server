const mongoose = require("mongoose");
const { formatDate } = require("../../utils/getCurrentDate");
const Schema = mongoose.Schema;

const transSchema = new Schema({
  transUsername: {
    type: String,
  },
  transNameCoin: {
    type: String,
  },
  transType: {
    type: String,
  },
  transAmount: {
    type: String,
  },
  transTime: {
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transSchema);
module.exports = Transaction;
