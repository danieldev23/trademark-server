const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        
    },
    roles: {
        type: [String]
    }
    ,
    username: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    bankNumber: {
        type: String
    },
    bankName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    verifyCode: {
        type: String,   
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;