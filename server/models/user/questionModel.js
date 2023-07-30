const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    question: Object,
    tags: [],
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
    views: {
        count: {
            type: Number,
            default: 0
        },
        unique: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }]
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "answers"
    }],
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

module.exports = mongoose.model("questions", questionSchema);