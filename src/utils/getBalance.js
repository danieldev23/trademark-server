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

const getBalanceCoin = async (username, coinCode) => {
    try {
        const wallet = await Wallet.findOne({ username});
        if(wallet) {
            const coin = wallet.coins.find(coin => coin.coinCode === coinCode);
            if(coin) {
                return coin.balanceCoin;
            }
            else {
                return "Coin not found!";
            }
        }
        else {
            return "Wallet not found!";
        }
  } catch(err) {
    console.log(err)
  
  }
}
async function main() {
    const balance = await getBalance("huydeveloper62");
    console.log(balance);
}
main();
module.exports = {getBalance};