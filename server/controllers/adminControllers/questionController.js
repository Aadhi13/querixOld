const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");


const questionsDataGet = async (req, res) => {
    try {
        console.log('req.query.page', req.query.page);
        console.log('req.query.limit', req.query.limit);
        const { requestPage, requestLimit } = req.query;
        const page = parseInt(requestPage, 10) || 0;
        const limit = parseInt(requestLimit, 10) || 10;
        console.log('page =>', page, '\n', 'limit =>', limit);

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
        await questionData.findByIdAndUpdate(questionId, { $set: { blockStatus: true } })
        return res.status(200).json({ success: true, message: "Question blocked successfully" })
    } catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
}

const questionUnBlock = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        await questionData.findByIdAndUpdate(questionId, { $set: { blockStatus: false } })
        return res.status(200).json({ success: true, message: "Question unblocked successfully" })
    } catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
}


module.exports = {
    questionsDataGet,
    questionBlock,
    questionUnBlock,
};