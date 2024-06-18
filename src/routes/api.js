const express = require("express");
const { getUser, getWallet } = require("../app/controllers/HomeController");
const { getListSell, getListBuy } = require("../utils/getTransaction");
const router = express.Router();
const { getBalance, getBalanceCoin } = require("../utils/getBalance");
const { formatDate } = require("../utils/getCurrentDate");
const User = require("../app/models/User");
const Wallet = require("../app/models/Wallet");
const Bank = require("../app/models/Bank");
const { genUsername } = require("../utils/genUsername");
const Transaction = require("../app/models/Transaction");
const {
  getCurrentCoin,
  getPriceCoin,
  getCoinCodeFromCoinbase,
} = require("../utils/getCurrentCoin");
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
          .json({ success: false, message: "Token không hợp lệ." });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ success: false, message: "Không có token." });
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
        message: "Không tìm thấy ví!",
      });
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy ví:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy ví.",
    });
  }
});

router.post('/admin/bank/create', async (req, res) => {
  try {
    const { name, account, user, isActive } = req.body;
    const bank = new Bank({
      name,
      account,
      user,
      // isActive,
    });
    await bank.save();
    return res.json({
      success: true,
      message: "Tạo tài khoản ngân hàng thành công!",
    });
  }
  catch(error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo tài khoản ngân hàng.",
    });
  }
});

router.get('/admin/bank', async (req, res) => {
  try {
    const bank = await Bank.find();
    return res.json(bank);
  }
  catch(error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy thông tin tài khoản ngân hàng.",
    });
  }
});
router.post("/api/admin/bank/update/:id", async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const bank = await Bank.findByIdAndUpdate(id, { isActive }, { new: true });
    if (bank) {
      res.json({
        success: true,
        message: "Cập nhật tài khoản ngân hàng thành công.",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản ngân hàng.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật tài khoản ngân hàng.",
    });
  }
});

router.post('/admin/bank/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await Bank.findByIdAndDelete(id);
    if (bank) {
      return res.json({
        success: true,
        message: "Xóa tài khoản ngân hàng thành công!",
      });
    } else {
      return res.json({
        success: false,
        message: "Xóa tài khoản ngân hàng thất bại!",
      });
    }
  }
  catch(error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa tài khoản ngân hàng.",
    });
  }
});
// Đăng ký người dùng
router.post("/user/create", async (req, res) => {
  try {
    const exists = await User.findOne({
      email: req.body.email,
    });

    if (exists) {
      return res.json({
        success: false,
        message: "Người dùng đã tồn tại",
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
          message: "Tạo người dùng thành công!",
          token, // Trả về token
        });
      } else {
        return res.json({
          success: false,
          message: "Tạo người dùng thất bại!",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo người dùng.",
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
            message: "Đăng nhập thành công!",
            roles: ["admin"],
            token,
          });
        } else {
          return res.json({
            success: true,
            name: user.name,
            username: user.username,
            message: "Đăng nhập thành công!",
            roles: ["user"], // Đảm bảo roles là một mảng
            token,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Thông tin đăng nhập không hợp lệ!",
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Không tìm thấy người dùng!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi đăng nhập.",
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const allUser = await getUser();
    return res.json(allUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách người dùng.",
    });
  }
});

router.post("/user/info/update/", async (req, res) => {
  try {
    const { email, bankName, bankNumber, name, phoneNumber, wallet } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { bankName, bankNumber, name, phoneNumber }
    );
    // const currentBalance = await getBalance(user.username);
    // const addBalance = Number(currentBalance) + Number(wallet.balance);
    if (user) {
      return res.json({
        success: true,
        message: "Cập nhật thông tin người dùng thành công!",
      });
    } else {
      return res.json({
        success: false,
        message: "Cập nhật thông tin người dùng thất bại!",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật thông tin người dùng.",
    });
  }
});

router.get("/coins", async (req, res) => {
  try {
    const coins = getCoinCodeFromCoinbase();

    if (coins) {
      return res.json({
        success: true,
        coins,
      });
    } else {
      return res.json({
        success: false,
        message: "Không tìm thấy đồng coin!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã có lỗi xảy ra");
  }
});

router.post("/admin/user/info/update/", async (req, res) => {
  try {
    const { email, bankName, bankNumber, name, phoneNumber, wallet } = req.body;
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
        message: "Cập nhật thông tin người dùng thành công!",
      });
    } else {
      return res.json({
        success: false,
        message: "Cập nhật thông tin người dùng thất bại!",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật thông tin người dùng.",
    });
  }
});

router.post("/user/sell/coin", async (req, res) => {
  const { username, coinCode, amount } = req.body;

  try {
    const priceCoin = await getPriceCoin(coinCode);
    const fixedPriceCoin = parseFloat(priceCoin).toFixed(0);
    const walletBalance = await getBalance(username);
    const currentBalanceCoin = await getBalanceCoin(username, coinCode);

    if (Number(currentBalanceCoin) >= Number(amount) && Number(amount) > 0) {
      const newBalanceCoin = (
        Number(currentBalanceCoin) - Number(amount)
      ).toString();
      const newWalletBalance = (
        Number(walletBalance) +
        Number(fixedPriceCoin) * Number(amount)
      ).toString();

      const walletUpdateResult = await Wallet.findOneAndUpdate(
        { username, "coins.code": coinCode },
        {
          $set: {
            "coins.$.balance": newBalanceCoin,
            balance: newWalletBalance,
          },
        },
        { new: true }
      );

      if (walletUpdateResult) {
        const transaction = new Transaction({
          transUsername: username,
          transNameCoin: coinCode,
          transType: "sell",
          transAmount: amount,
          transTime: new Date().toISOString(),
        });
        await transaction.save();

        return res.json({
          success: true,
          wallet: walletUpdateResult,
          message: "Bán coin thành công!",
        });
      } else {
        return res.json({
          success: false,
          message: "Bán coin thất bại!",
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Bạn không có đủ coin để bán!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi thực hiện giao dịch bán.",
    });
  }
});

router.post("/user/buy/coin", async (req, res) => {
  const { username, amount, coinCode } = req.body;

  try {
    const priceCoin = await getPriceCoin(coinCode);
    const fixedPriceCoin = parseFloat(priceCoin).toFixed(0);
    const walletBalance = await getBalance(username);
    const totalCost = (Number(fixedPriceCoin) * Number(amount)).toFixed(0);

    if (Number(walletBalance) >= Number(totalCost) && Number(amount) > 0) {
      const currentBalanceCoin = await getBalanceCoin(username, coinCode);
      const newBalanceCoin = (
        Number(currentBalanceCoin) + Number(amount)
      ).toString();
      const newWalletBalance = (
        Number(walletBalance) - Number(totalCost)
      ).toString();

      const walletUpdateResult = await Wallet.findOneAndUpdate(
        { username, "coins.code": coinCode },
        {
          $set: {
            "coins.$.balance": newBalanceCoin,
            balance: newWalletBalance,
          },
        },
        { new: true }
      );

      if (!walletUpdateResult) {
        await Wallet.findOneAndUpdate(
          { username },
          {
            $push: { coins: { code: coinCode, balance: newBalanceCoin } },
            balance: newWalletBalance,
          }
        );
      }

      const transaction = new Transaction({
        transUsername: username,
        transNameCoin: coinCode,
        transType: "buy",
        transAmount: amount,
        transTime: new Date().toISOString(),
      });
      await transaction.save();

      return res.json({
        success: true,
        wallet: walletUpdateResult,
        message: "Mua coin thành công!",
      });
    } else {
      return res.json({
        success: false,
        message: "Bạn không có đủ số dư để mua coin!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi thực hiện giao dịch mua.",
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
    const transaction = await Transaction.find();
    if (transaction) {
      return res.json({
        success: true,
        transactions: transaction,
      });
    } else {
      return res.json({
        success: false,
        message: "Không tìm thấy giao dịch!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy giao dịch.",
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
          message: "Không lấy được thông tin coin hiện tại",
        });
      }
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: "Không lấy được thông tin coin hiện tại",
      });
    });
});

module.exports = router;
