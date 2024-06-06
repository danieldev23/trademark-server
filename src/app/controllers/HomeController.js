const User = require("../models/User");
const Transaction = require("../models/Transaction");
const getUser = async () => {
  const allUser = User.find().select("-password").select("-_id")
  return allUser;
};

const getWallet = async (username) => {
  const amount = await User.findOne(
    {
      username: username,
    },
    "wallet"
  );
  if (amount) {
    return amount.wallet;
  } else {
    return "Wallet not found!";
  }
};

module.exports = { getUser, getWallet };
