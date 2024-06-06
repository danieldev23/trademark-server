const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coinSchema = new Schema({
  coinName: {
    type: String,
  },
  coinAmount: {
    type: String,
  },
  currentPrice: {
    type: String,
  },
  priceChange: {
    type: String,
  },
});

const Coin = mongoose.model("Coin", coinSchema);
module.exports = Coin;
