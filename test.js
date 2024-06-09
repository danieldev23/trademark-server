const { default: axios } = require("axios");
const { futimesSync } = require("fs");


async function getPriceCoin(coinCode) {
  try {
      const response = await axios.get(`https://api.coinbase.com/v2/prices/${coinCode}-USD/spot`);

      // Giả sử bạn muốn lấy giá bằng VND, bạn cần chuyển đổi từ USD sang VND
      const usdPrice = response.data.data.amount;
      
      // Lấy tỷ giá USD-VND từ một nguồn khác, ví dụ từ một API hoặc một giá trị cố định
      const exchangeRate = await getExchangeRate('USD', 'VND');
      
      const vndPrice = usdPrice * exchangeRate;
      return vndPrice;
  } catch (error) {
      console.error(`Error fetching price for ${coinCode}:`, error.message || error);
      throw error;
  }
}

async function getPrice() {
  const res = await getPriceCoin('BTC');
  console.log(res);
}
getPrice();