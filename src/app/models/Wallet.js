const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinSchema = new Schema({
    coinCode: {
        type: String,
        // required: true
    },
    balanceCoin: {
        type: String,
        // required: true
    }
});

const walletSchema = new Schema({
    username: {
        type: String,
        // ref: 'User',
        // required: true
    },
    balance: {
        type: String,
        default: 0,
        // required: true
    },
    coins: {
        type: [coinSchema],
        default: []
    }
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
