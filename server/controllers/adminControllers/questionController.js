const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const reportedQuestionData = require("../../models/user/reportedQuestionModel");
const ObjectId = mongoose.Types.ObjectId;


const questionsDataGet = async (req, res) => {
    try {
        const { requestPage, requestLimit } = req.query;
        const page = parseInt(requestPage, 10) || 0;
        const limit = parseInt(requestLimit, 10) || 100;

        const questionsData = await questionData.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "authorDetails",
                },
            },
            {
                $project: {
                    _id: 1,
                    question: 1,
                    tags: 1,
                    createdAt: 1,
                    blockStatus: 1,
                    updatedAt: 1,
                    author: {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: "$authorDetails",
                                    as: "author",
                                    in: {
                                        userId: "$$author._id",
                                        userName: "$$author.userName",
                                        name: "$$author.name",
                                    },
                                },
                            },
                            0,
                        ],
                    },
                    votes: {
                        $let: {
                            vars: {
                                upVotes: { $size: { $ifNull: ["$votes.upVote.userId", []] } },
                                downVotes: { $size: { $ifNull: ["$votes.downVote.userId", []] } },
                            },
                            in: {
                                upVotes: "$$upVotes",
                                downVotes: "$$downVotes",
                            },
                        },
                    },
                    answersCount: { $cond: { if: { $isArray: "$answers" }, then: { $size: "$answers" }, else: 0 } },
                    commentsCount: { $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: 0 } },
                },
            },
            { $sort: { _id: -1 } },
            { $skip: limit * page },
            { $limit: limit },
        ]);

        const questionsCount = await questionData.countDocuments();
        return res.status(200).json({ message: 'Questions data sended', questionsData, questionsCount });
    } catch (err) {
        console.log(err.message);
    }

}

const questionBlock = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        //Logic for managing reportedQuestions status 
        const reportedQuestionDetails = await reportedQuestionData.find({ question: questionId });
        if (reportedQuestionDetails[0]?.status != 'blocked') {
            await reportedQuestionData.findOneAndUpdate({ question: questionId }, { $set: { status: 'blocked' } });
        }
        await questionData.findByIdAndUpdate(questionId, { $set: { blockStatus: true } })
        return res.status(200).json({ success: true, message: "Question blocked successfully" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Server error.' });
    }
}

const questionUnBlock = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        //Logic for managing reportedQuestions status 
        const reportedQuestionDetails = await reportedQuestionData.find({ question: questionId });
        if (reportedQuestionDetails[0]?.status == 'blocked') {
            await reportedQuestionData.findOneAndUpdate({ question: questionId }, { $set: { status: 'reviewed' } });
        }
        await questionData.findByIdAndUpdate(questionId, { $set: { blockStatus: false } })
        return res.status(200).json({ success: true, message: "Question unblocked successfully" })
    } catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
}

const reportedQuestionsDataGet = async (req, res) => {
    try {
        const { requestPage, requestLimit } = req.query;
        const page = parseInt(requestPage, 10) || 0;
        const limit = parseInt(requestLimit, 10) || 10;

        const reportedQuestionsData = await reportedQuestionData.aggregate([
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
                    from: "questions",
                    localField: "question",
                    foreignField: "_id",
                    as: "questionDetails",
                },
            },
            {
                $unwind: "$authorDetails",
            },
            {
                $unwind: "$questionDetails",
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
                    question: {
                        _id: "$questionDetails._id",
                        title: "$questionDetails.question.title",
                        body: "$questionDetails.question.body",
                    },
                    blockStatus: "$questionDetails.blockStatus",
                    votesCount: {
                        $subtract: [
                            { $size: { $ifNull: ["$questionDetails.votes.upVote.userId", []] } },
                            { $size: { $ifNull: ["$questionDetails.votes.downVote.userId", []] } },
                        ],
                    },
                    answersCount: { $size: { $ifNull: ["$questionDetails.answers", []] } },
                    commentsCount: { $size: { $ifNull: ["$questionDetails.comments", []] } },

                },
            },
            { $sort: { _id: -1 } },
            { $skip: limit * page },
            { $limit: limit },
        ]);

        const questionsCount = await reportedQuestionData.countDocuments();
        return res.status(200).json({ message: 'Reported Questions data sent', reportedQuestionsData, questionsCount });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const reportedQuestionReasonsDataGet = async (req, res) => {
    try {
        const reportedQuestionId = req.query.reportedQuestionId;
        const reportedQuestionDetails = await reportedQuestionData.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(reportedQuestionId) } },
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
        if (!reportedQuestionDetails || reportedQuestionDetails.length === 0) {
            return res.status(404).json({ message: "Invalid reported question." });
        } else {
            const reportedQuestionReasonsData = reportedQuestionDetails.map(item => ({ _id: item._id, reason: item.reason, user: { userId: item.users.userId.toString(), userName: item.users.userName, name: item.users.name } }));
            return res.status(200).json({ message: "Sended reasons for the reported question ", reportedQuestionReasonsData });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = {
    questionsDataGet,
    questionBlock,
    questionUnBlock,
    reportedQuestionsDataGet,
    reportedQuestionReasonsDataGet
};