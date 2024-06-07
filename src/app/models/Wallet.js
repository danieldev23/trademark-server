const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
});

const walletSchema = new Schema({
    username: {
        type: String,
        ref: 'User',
        required: true
    },
    balance: {
        type: String,
        required: true
    },
    coins: [coinSchema] 
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
