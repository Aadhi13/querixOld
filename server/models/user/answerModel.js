const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    answer: Object,
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions'
    },
    votes: {
        upVote: {
            count: {
                type: Number,
                default: 0
            },
            userId: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }]
        },
        downVote: {
            count: {
                type: Number,
                default: 0
            },
            userId: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }]
        },
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
    }],
    blockStatus: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
);


module.exports = mongoose.model("answers", answerSchema);