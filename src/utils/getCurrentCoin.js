const axios = require("axios");
const API =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,tether,cardano";

async function getCurrentCoin() {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ API.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    return null;
  }
}

async function getCoinNameFromCode(coinCode) {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinCode}`
    );
    const coinData = response.data;
    return coinData.name;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const getPriceCoin = async (coinCode) => {
  try {
    const response = await axios.get(
      `https://api.coinbase.com/v2/prices/${coinCode}-vnd/spot`
    );
    const price =
      response.data && response.data.data ? response.data.data.amount : "0";
    return price;
  } catch (e) {
    console.log('Error fetching price for', coinCode, e.message || e);
  }
};

function getCoinCodeFromCoinbase() {
  try {
    coins = [
      "BTC",
      "ETH",
      "BNB",
      "USDT",
      "USDC",
      "XRP",
      "ADA",
      "SOL",
      "DOGE",
      "DOT",
      "AVAX",
      "TRX",
      "SHIB",
      "DAI",
      "WBTC",
      "LTC",
      "LEO",
      "LINK",
      "FTT",
      "ATOM",
      "ETC",
      "XLM",
      "ALGO",
      "BCH",
      "XMR",
      "VET",
      "AAVE",
      "THETA",
      "XTZ",
      "AXS",
      "EGLD",
      "HBAR",
      "FIL",
      "SAND",
      "FTM",
      "MANA",
      "CAKE",
      "EOS",
      "QNT",
      "FLOW",
      "ZEC",
      "CHZ",
      "ONE",
      "HNT",
      "ENJ",
      "KAVA",
      "MKR",
      "KCS",
      "HT",
      "AR",
      "NEXO",
      "SUSHI",
      "BTT",
      "RUNE",
      "1INCH",
      "OKB",
      "BAT",
      "CRV",
      "TUSD",
      "CELO",
      "AMP",
      "STX",
      "OMG",
      "HOT",
      "RVN",
      "COMP",
      "LUNA",
      "CEL",
      "ANKR",
      "XEM",
      "YFI",
      "DCR",
      "XDC",
      "DGB",
      "ZIL",
      "WAVES",
      "REN",
      "RSR",
      "IOTX",
      "ZEN",
      "BAL",
      "KNC",
      "LSK",
      "NANO",
      "BTS",
      "ONT",
      "ICX",
      "PUNDIX",
      "SNX",
      "BNT",
      "CKB",
      "CVC",
      "STORJ",
      "ETN",
      "SYS",
      "POLY",
      "WAXP",
      "POWR",
      "META",
      "DENT",
    ];
    return coins
} catch (error) {
    console.error('Error fetching coin symbols:', error);
}
}

module.exports = { getCurrentCoin, getPriceCoin, getCoinCodeFromCoinbase };
