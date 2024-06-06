const Transaction = require("../app/models/Transaction");
const getListSell = async () => {
  const listSell = Transaction.find({ transType: "sell" });
  return listSell;
};
const getListBuy = async () => {
  const listBuy = Transaction.find({ transType: "buy" });
  return listBuy;
};

module.exports = { getListSell, getListBuy };
