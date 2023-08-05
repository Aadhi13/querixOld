const mongoose = require('mongoose');

const reportedQuestionSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions',
    },
    reportedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "answers"
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

module.exports = mongoose.model("reportedQuestions", reportedQuestionSchema);