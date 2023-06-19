const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    savedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions'
    }],
    blockStatus: {
        type: Boolean,
        default: false
    },
    verifyStatus: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('users', userSchema);