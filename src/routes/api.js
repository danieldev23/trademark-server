const express = require("express");
const { getUser, getWallet } = require("../app/controllers/HomeController");
const { getListSell, getListBuy } = require("../utils/getTransaction");
const router = express.Router();
const { getBalance, getBalanceCoin } = require("../utils/getBalance");
const { formatDate } = require("../utils/getCurrentDate");
const User = require("../app/models/User");
const Wallet = require("../app/models/Wallet");
const { genUsername } = require("../utils/genUsername");
const Transaction = require("../app/models/Transaction");
const { getCurrentCoin, getPriceCoin } = require("../utils/getCurrentCoin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = "danieldev";

const expiresIn = "24h";

function createToken(payload) {
  console.log(jwt.sign(payload, secretKey, { expiresIn }));
  return jwt.sign(payload, secretKey, { expiresIn });
}

// Middleware
function checkToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token." });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Tokens not provided." });
  }
}

router.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleString("vi-VN")}] ${req.method} ${req.originalUrl}`
  );
  next();
});

router.get("/wallet/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const wallet = await Wallet.findOne({ username });
    if (wallet) {
      return res.json({
        success: true,
        wallet: {
          coins: wallet.coins,
          balance: wallet.balance,
        },
      });
    } else {
      return res.json({
        success: false,
        message: "Wallet not found!",
      });
    }
  } catch (error) {
    console.error("An error occurred while retrieving the wallet:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving wallet.",
    });
  }
});
// Đăng ký người dùng
router.post("/user/create", async (req, res) => {
  try {
    const exists = await User.findOne({
      email: req.body.email,
      username: req.body.username,
    });

    if (exists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    } else {
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const username = genUsername(req.body.name);
      const newUser = {
        name: req.body.name,
        roles: ["user"], // Đảm bảo roles là một mảng
        username: username,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hashedPassword,
      };
      const newWallet = await Wallet.create({
        username: username,
        balance: "0",
        coin: [],
      });
      const status = await User.create(newUser);
      if (status) {
        // Tạo token sau khi đăng ký thành công
        const token = createToken({
          username: newUser.username,
          roles: newUser.roles,
        });
        return res.json({
          success: true,
          message: "User created successfully!",
          token, // Trả về token
        });
      } else {
        return res.json({
          success: false,
          message: "User creation failed!",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during user creation.",
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = createToken({
          username: user.username,
          roles: user.roles,
        });
        if (user.roles.includes("admin")) {
          return res.json({
            success: true,
            name: user.name,
            username: user.username,
            phoneNumber: user.phoneNumber,
            bankNumber: user.bankNumber,
            bankName: user.bankName,
            wallet: user.wallet,
            message: "Login successfully!",
            roles: ["admin"],
            token,
          });
        } else {
          return res.json({
            success: true,
            name: user.name,
            username: user.username,
            message: "Login successfully!",
            roles: ["user"], // Đảm bảo roles là một mảng
            token,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Invalid credentials!",
        });
      }
    } else {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
});

// router.post("/user/add/balance/:username", async (req, res) => {
//   const { username } = req.params;
//   const { amount } = req.body;

//   console.log(typeof amount);
//   try {
//     const wallet = await Wallet.findOne({ username });
//     console.log(wallet);
//     if (wallet) {
//       const total = Number(wallet.balance) + Number(amount);
//       const status = await Wallet.findOneAndUpdate(
//         { username },
//         { balance: total.toString(), new: true }
//       );
//       if (status) {
//         return res.json({
//           success: true,
//           message: "Balance added successfully!",
//         });
//       } else {
//         return res.json({
//           success: false,
//           message: "Failed to add balance!",
//         });
//       }
//     } else {
//       return res.json({
//         success: false,
//         message: "Wallet not found!",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while adding balance.",
//     });
//   }
// });

router.get("/users", async (req, res) => {
  try {
    const allUser = await getUser();
    return res.json(allUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving users.",
    });
  }
});
router.post("/user/info/update/", async (req, res) => {
  try {
    const {
      email,
      bankName,
      bankNumber,
      name,
      phoneNumber,
      wallet
    } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { bankName, bankNumber, name, phoneNumber }
    );
    const currentBalance = await getBalance(user.username);
    const addBalance = Number(currentBalance) + Number(wallet.balance);
    const walletUpdate = await Wallet.findOneAndUpdate(
      {
        username: user.username,
      },
      {
        balance: addBalance.toString(),
        coins: wallet.coins,
      }
    );
    if (user && walletUpdate) {
      return res.json({
        success: true,
        message: "Update user info successfully!",
      });
    } else {
      return res.json({
        success: false,
        message: "Update user info failed!",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "An error occurred during updating user info.",
    });
  }
});
router.post("/user/sell/coin", async (req, res) => {
  const { username, coinCode, amount } = req.body;

  try {
      // Get the current price of the coin
      const priceCoin = await getPriceCoin(coinCode);
      const fixedPriceCoin = parseFloat(priceCoin).toFixed(0);

      // Get the user's wallet balance
      const walletBalance = await getBalance(username);

      // Get the current balance of the coin in the user's wallet
      const currentBalanceCoin = await getBalanceCoin(username, coinCode);

      // Check if the user has enough balance to sell the specified amount of the coin
      if (Number(currentBalanceCoin) >= Number(amount) && Number(amount) > 0) {
          // Calculate the new coin balance after selling
          const newBalanceCoin = (Number(currentBalanceCoin) - Number(amount)).toString();

          // Calculate the new wallet balance after selling the coin
          const newWalletBalance = (Number(walletBalance) + Number(fixedPriceCoin) * Number(amount)).toString();

          // Update the user's wallet with the new coin balance and wallet balance
          const walletUpdateResult = await Wallet.findOneAndUpdate(
              { username, 'coins.code': coinCode },
              {
                  $set: {
                      'coins.$.balance': newBalanceCoin,
                      balance: newWalletBalance
                  }
              },
              { new: true }
          );

          if (walletUpdateResult) {
              return res.json({
                  success: true,
                  message: "Sell coin successfully!",
              });
          } else {
              return res.json({
                  success: false,
                  message: "Sell coin failed!",
              });
          }
      } else {
          return res.json({
              success: false,
              message: "You do not have enough coin to sell!",
          });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "An error occurred during the selling transaction.",
      });
  }
});

router.post("/user/buy/coin", async (req, res) => {
  const { username, amount, coinCode } = req.body;

  try {
      // Get the current price of the coin
      const priceCoin = await getPriceCoin(coinCode);
      const fixedPriceCoin = parseFloat(priceCoin).toFixed(0);

      // Get the user's current wallet balance
      const walletBalance = await getBalance(username);

      // Calculate the total cost of the coins to be bought
      const totalCost = (Number(fixedPriceCoin) * Number(amount)).toFixed(0);

      // Check if the user has enough balance to buy the specified amount of the coin
      if (Number(walletBalance) >= Number(totalCost) && Number(amount) > 0) {
          // Get the current balance of the coin in the user's wallet
          const currentBalanceCoin = await getBalanceCoin(username, coinCode);

          // Calculate the new coin balance after buying
          const newBalanceCoin = (Number(currentBalanceCoin) + Number(amount)).toString();

          // Calculate the new wallet balance after deducting the total cost
          const newWalletBalance = (Number(walletBalance) - Number(totalCost)).toString();

          // Update the user's wallet with the new coin balance and wallet balance
          const walletUpdateResult = await Wallet.findOneAndUpdate(
              { username, 'coins.code': coinCode },
              {
                  $set: {
                      'coins.$.balance': newBalanceCoin,
                      balance: newWalletBalance
                  }
              },
              { new: true }
          );

          // If the coin doesn't exist, add it to the wallet
          if (!walletUpdateResult) {
              await Wallet.findOneAndUpdate(
                  { username },
                  {
                      $push: { coins: { code: coinCode, balance: newBalanceCoin } },
                      balance: newWalletBalance
                  }
              );
          }

          return res.json({
              success: true,
              message: "Buy coin successfully!",
          });
      } else {
          return res.json({
              success: false,
              message: "You do not have enough balance to buy the coin!",
          });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "An error occurred during the buying transaction.",
      });
  }
});


router.get("/home/settings", (req, res) => {
  return res.json({
    websiteName: "BO Web",
  });
});
router.get("/transactions", async (req, res) => {
  try {
    const [listSell, listBuy] = await Promise.all([
      getListSell(),
      getListBuy(),
    ]);
    return res.json({
      success: true,
      transactions: {
        sell: listSell,
        buy: listBuy,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching transactions.",
    });
  }
});

router.get("/sell/list", async (req, res) => {
  const listSell = await getListSell();
  return res.json(listSell);
});

router.get("/buy/list", async (req, res) => {
  const listBuy = await getListBuy();
  return res.json(listBuy);
});

router.get("/coin/list", async (req, res) => {
  getCurrentCoin()
    .then((currentCoin) => {
      if (currentCoin) {
        return res.status(200).json(currentCoin);
      } else {
        return res.json({
          success: false,
          message: "Do not get current coin",
        });
      }
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: "Do not get current coin",
      });
    });
});

module.exports = router;
