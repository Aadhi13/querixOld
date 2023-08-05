const mongoose = require('mongoose');

const reportedAnswerSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'answers',
    },
    reportedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        reason: Object,
    }],
    status: {
        type: String,
        default: "pending",
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("reportedAnswers", reportedAnswerSchema);