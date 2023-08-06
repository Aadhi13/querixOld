const mongoose = require('mongoose');

const reportedCommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
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

module.exports = mongoose.model("reportedComments", reportedCommentSchema);