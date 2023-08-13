const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
const commentData = require("../../models/user/commentModel");
const reportedQuestionData = require("../../models/user/reportedQuestionModel");
const reportedCommentData = require("../../models/user/reportedCommentModel");
const reportedAnswerData = require("../../models/user/reportedAnswerModel");
const ObjectId = mongoose.Types.ObjectId;

const reportedCommentsDataGet = async (req, res) => {
    try {
        const { requestPage, requestLimit } = req.query;
        const page = parseInt(requestPage, 10) || 0;
        const limit = parseInt(requestLimit, 10) || 10;

        const reportedCommentsData = await reportedCommentData.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "comment",
                    foreignField: "_id",
                    as: "commentDetails",
                },
            },
            {
                $unwind: "$authorDetails",
            },
            {
                $unwind: "$commentDetails",
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    status: 1,
                    updatedAt: 1,
                    reportsCount: { $size: "$reportedBy" },
                    author: {
                        _id: "$authorDetails._id",
                        userName: "$authorDetails.userName",
                        name: "$authorDetails.name",
                    },
                    comment: {
                        _id: "$commentDetails._id",
                        body: "$commentDetails.comment",
                    },
                    blockStatus: "$commentDetails.blockStatus",
                },
            },
            { $sort: { _id: -1 } },
            { $skip: limit * page },
            { $limit: limit },
        ]);

        const commentsCount = await reportedCommentData.countDocuments();
        return res.status(200).json({ message: 'Reported Comment data sent', reportedCommentsData, commentsCount });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const reportedCommentReasonsDataGet = async (req, res) => {
    try {
        const reportedCommentId = req.query.reportedCommentId;
        const reportedCommentDetails = await reportedCommentData.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(reportedCommentId) } },
            { $unwind: "$reportedBy" },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedBy.userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    _id: "$reportedBy._id",
                    reason: "$reportedBy.reason",
                    users: { $arrayElemAt: [{ $map: { input: "$userDetails", in: { userId: "$$this._id", userName: "$$this.userName", name: "$$this.name" } } }, 0] }
                }
            }
        ]);

        if (!reportedCommentDetails || reportedCommentDetails.length === 0) {
            return res.status(404).json({ message: "Invalid reported comment." });
        } else {
            const reportedCommentReasonsData = reportedCommentDetails.map(item => ({ _id: item._id, reason: item.reason, user: { userId: item.users.userId.toString(), userName: item.users.userName, name: item.users.name } }));
            return res.status(200).json({ message: "Sended reasons for the reported comment. ", reportedCommentReasonsData });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const commentBlock = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        //Logic for managing reportedComment status 
        const reportedCommentDetails = await reportedCommentData.find({ comment: commentId });
        if (reportedCommentDetails[0]?.status != 'blocked') {
            await reportedCommentData.findOneAndUpdate({ comment: commentId }, { $set: { status: 'blocked' } });
        }
        await commentData.findByIdAndUpdate(commentId, { $set: { blockStatus: true } })
        return res.status(200).json({ success: true, message: "Comment blocked successfully" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const commentUnBlock = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        //Logic for managing reportedQuestions status 
        const reportedCommentDetails = await reportedCommentData.find({ comment: commentId });
        if (reportedCommentDetails[0]?.status == 'blocked') {
            await reportedCommentData.findOneAndUpdate({ comment: commentId }, { $set: { status: 'reviewed' } });
        }
        await commentData.findByIdAndUpdate(commentId, { $set: { blockStatus: false } })
        return res.status(200).json({ success: true, message: "Comment unblocked successfully" })
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    reportedCommentsDataGet,
    reportedCommentReasonsDataGet,
    commentBlock,
    commentUnBlock,
}