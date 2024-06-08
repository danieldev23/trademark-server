const Wallet = require("../app/models/Wallet")


const getBalance = async (username) => {
    try {
        const wallet = await Wallet.findOne({ username});
        if(wallet) {
          return wallet.balance
        }
        else {
          return "Wallet not found!";
        }
    }
    catch(err) {
        console.log(err)
    }
}

async function getBalanceCoin(username, coinCode) {
  try {
      // Find the wallet by username
      const wallet = await Wallet.findOne({ username });

      // If the wallet doesn't exist, throw an error
      if (!wallet) {
          throw new Error('Wallet not found');
      }

      // Find the coin in the wallet's coins array
      const coin = wallet.coins.find(c => c.code === coinCode);

      // If the coin doesn't exist, return a balance of 0
      if (!coin) {
          return '0';
      }

      // Return the balance of the coin
      return coin.balance;
  } catch (error) {
      console.error(error);
      throw new Error('Error retrieving coin balance');
  }
}

module.exports = {getBalance, getBalanceCoin};