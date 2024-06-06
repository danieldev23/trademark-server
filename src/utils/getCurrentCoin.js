
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

module.exports = {getCurrentCoin};
