const axios = require('axios');
const API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,tether,cardano";

async function getCurrentCoin() {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu từ API.');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        return null;
    }
}


async function getCoinNameFromCode(coinCode) {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinCode}`);
      const coinData = response.data;
      return coinData.name;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  

const getPriceCoin = async (coinCode) => {
    const coinName = await getCoinNameFromCode(coinCode);
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=vnd`);
        const data = response.data;
        const vndPrice = data.bitcoin.vnd;
        return vndPrice;
    } catch (error) {
        console.error(error);
        return null;
    }
}



module.exports = {getCurrentCoin, getPriceCoin}; 