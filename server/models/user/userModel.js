const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    blockStatus: {
        type: Boolean,
        default: false
    },
    verifyStatus: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('user', userSchema);