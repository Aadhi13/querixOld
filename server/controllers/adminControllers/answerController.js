const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
const reportedQuestionData = require("../../models/user/reportedQuestionModel");
const reportedAnswerData = require("../../models/user/reportedAnswerModel");
const ObjectId = mongoose.Types.ObjectId;

const reportedAnswersDataGet = async (req, res) => {
    try {
        const { requestPage, requestLimit } = req.query;
        const page = parseInt(requestPage, 10) || 0;
        const limit = parseInt(requestLimit, 10) || 10;

        const reportedAnswersData = await reportedAnswerData.aggregate([
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
                    from: "answers",
                    localField: "answer",
                    foreignField: "_id",
                    as: "answerDetails",
                },
            },
            {
                $unwind: "$authorDetails",
            },
            {
                $unwind: "$answerDetails",
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
                    answer: {
                        _id: "$answerDetails._id",
                        body: "$answerDetails.answer",
                    },
                    blockStatus: "$answerDetails.blockStatus",
                    votesCount: {
                        $subtract: [
                            { $size: { $ifNull: ["$answerDetails.votes.upVote.userId", []] } },
                            { $size: { $ifNull: ["$answerDetails.votes.downVote.userId", []] } },
                        ],
                    },
                },
            },
            { $sort: { _id: -1 } },
            { $skip: limit * page },
            { $limit: limit },
        ]);

        const answersCount = await reportedAnswerData.countDocuments();
        return res.status(200).json({ message: 'Reported Answers data sent', reportedAnswersData, answersCount });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const reportedAnswerReasonsDataGet = async (req, res) => {
    try {
        const reportedAnswerId = req.query.reportedAnswerId;
        console.log('repo ans id', reportedAnswerId);
        const reportedAnswerDetails = await reportedAnswerData.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(reportedAnswerId) } },
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
        console.log('repoAnswerdetails', reportedAnswerDetails);

        if (!reportedAnswerDetails || reportedAnswerDetails.length === 0) {
            return res.status(404).json({ message: "Invalid reported answer." });
        } else {
            const reportedAnswerReasonsData = reportedAnswerDetails.map(item => ({ _id: item._id, reason: item.reason, user: { userId: item.users.userId.toString(), userName: item.users.userName, name: item.users.name } }));
            return res.status(200).json({ message: "Sended reasons for the reported answer. ", reportedAnswerReasonsData });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const answerBlock = async (req, res) => {
    try {
        const answerId = req.params.answerId;
        //Logic for managing reportedAnswers status 
        console.log('answer Id', answerId);
        const reportedAnswerDetails = await reportedAnswerData.find({ answer: answerId });
        if (reportedAnswerDetails[0]?.status != 'blocked') {
            await reportedAnswerData.findOneAndUpdate({ answer: answerId }, { $set: { status: 'blocked' } });
        }
        await answerData.findByIdAndUpdate(answerId, { $set: { blockStatus: true } })
        return res.status(200).json({ success: true, message: "Answer blocked successfully" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const answerUnBlock = async (req, res) => {
    try {
        const answerId = req.params.answerId;
        //Logic for managing reportedQuestions status 
        const reportedAnswerDetails = await reportedAnswerData.find({ answer: answerId });
        if (reportedAnswerDetails[0]?.status == 'blocked') {
            await reportedAnswerData.findOneAndUpdate({ answer: answerId }, { $set: { status: 'reviewed' } });
        }
        await answerData.findByIdAndUpdate(answerId, { $set: { blockStatus: false } })
        return res.status(200).json({ success: true, message: "Answer unblocked successfully" })
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    reportedAnswersDataGet,
    reportedAnswerReasonsDataGet,
    answerBlock,
    answerUnBlock,
}