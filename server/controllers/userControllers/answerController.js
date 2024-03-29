const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
const reportedAnswerData = require("../../models/user/reportedAnswerModel");
const ObjectId = mongoose.Types.ObjectId

const addAnswer = async (req, res) => {
    try {
        const userId = req.userId;
        const { input, questionId } = req.body;
        const userDetails = await userData.findById(userId);
        const questionDetails = await questionData.findById(questionId);
        if (!userDetails) {
            return res.status(401).json({ message: 'No user found.' });
        } else if (!input) {
            //Change below HTTP status code to proper one (Missing information/request. Invalid request. Request is not complete. Data is missing in request)
            return res.status(400).json({ message: 'Answer is not complete.' });
        } else if (!questionData) {
            return res.status(401).json({ message: 'Invalid question.' });
        }
        const answer = await answerData.create({
            author: userId,
            answer: input,
            question: questionId
        });
        await questionDetails.updateOne({ $push: { answers: answer._id } });
        return res.status(200).json({ message: 'Answer submitted.' });
    } catch (err) {

    }
}


const answersDataGet = async (req, res) => {
    try {
        const { page, questionId } = req.query;
        const perPage = 4;
        const skipCount = perPage * page;

        // Fetch valid and available answer IDs based on the question
        const question = await questionData.findById(questionId).select('answers');
        const availableAnswerIds = await answerData.find({
            _id: { $in: question.answers },
            blockStatus: false
        }).select('_id');

        const validAnswersCount = availableAnswerIds.length;
        const validAnswerIds = availableAnswerIds.map(answer => answer._id);

        // Fetch non-blocked answers based on valid answer IDs
        const answersData = await answerData
            .find({ _id: { $in: validAnswerIds } })
            .skip(skipCount)
            .limit(perPage)
            .populate('author', 'userName name')
            .sort({ _id: -1 });

        return res.status(200).json({ message: 'Answers data sent', answersData, answersCount: validAnswersCount });
    } catch (err) {
        console.log(err.message);
    }
}


const answerSave = async (req, res) => {
    try {
        const { answerId } = req.body
        const userId = req.userId;
        const userDetails = await userData.findById({ _id: userId });
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found.' });
        } else {
            await userDetails.updateOne({ $push: { 'savedAnswers': answerId } });
            return res.status(200).json({ message: 'Answer successfully saved.' })
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error." })
    }
}

const answerUnsave = async (req, res) => {
    try {
        const { answerId } = req.body
        const userId = req.userId;
        const userDetails = await userData.findById({ _id: userId });
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found.' });
        } else {
            await userDetails.updateOne({ $pull: { 'savedAnswers': answerId } });
            await userDetails.save();
            return res.status(200).json({ message: 'Answer successfully unsaved.' })
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error." })
    }
};

const answerVote = async (req, res) => {
    try {
        const userId = req.userId;
        const { voteIs, answerId } = req.body;
        const answer = await answerData.findById({ _id: new ObjectId(answerId) })
        if (voteIs == 'upVote') {
            if (answer.votes.upVote.userId.includes(userId)) { //upVoted answer >> upVote
                return res.status(304).json({ message: 'Already upVoted.' })
            } else if (answer.votes.downVote.userId.includes(userId)) { //downVoted answer >> upVote
                await answer.updateOne({ $pull: { 'votes.downVote.userId': userId }, $inc: { 'votes.downVote.count': -1 } });
                await answer.updateOne({ $push: { 'votes.upVote.userId': userId }, $inc: { 'votes.upVote.count': 1 } });
                await answer.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await answerData.findById(answerId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'UpVoted answer.', voteCount });
            } else {
                await answer.updateOne({ $push: { 'votes.upVote.userId': userId }, $inc: { 'votes.upVote.count': 1 } });
                await answer.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await answerData.findById(answerId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'UpVoted answer.', voteCount });
            }
        } else if (voteIs == 'downVote') {
            if (answer.votes.downVote.userId.includes(userId)) { //downVoted answer >> downVote
                return res.status(304).json({ message: 'Already downVoted.' })
            } else if (answer.votes.upVote.userId.includes(userId)) { //upvoted answer >> downVote
                await answer.updateOne({ $pull: { 'votes.upVote.userId': userId }, $inc: { 'votes.upVote.count': -1 } });
                await answer.updateOne({ $push: { 'votes.downVote.userId': userId }, $inc: { 'votes.downVote.count': 1 } });
                await answer.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await answerData.findById(answerId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'DownVoted answer.', voteCount });
            } else {
                await answer.updateOne({ $push: { 'votes.downVote.userId': userId }, $inc: { 'votes.downVote.count': 1 } });
                await answer.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await answerData.findById(answerId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'DownVoted answer.', voteCount });
            }
        } else if (voteIs == 'neutral') {
            if (answer.votes.upVote.userId.includes(userId)) { //upVoted answer >> neutral
                await answer.updateOne({ $pull: { 'votes.upVote.userId': userId }, $inc: { 'votes.upVote.count': -1 } });
                await answer.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await answerData.findById(answerId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'Answer is neutral.', voteCount })
            } else if (answer.votes.downVote.userId.includes(userId)) { //downVoted answer >> neutral
                await answer.updateOne({ $pull: { 'votes.downVote.userId': userId }, $inc: { 'votes.downVote.count': -1 } });
                await answer.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await answerData.findById(answerId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'Answer is neutral.', voteCount })
            } else {
                return res.status(304).json({ message: "Answer is already neutral." })
            }
        }

    } catch (err) {
        console.log(err.message);
    }
}

const reportAnswer = async (req, res) => {
    try {
        const { answerId } = req.body;
        const userId = req.userId;
        const answerDetails = await answerData.findById({ _id: answerId });
        if (!answerDetails) {
            return res.status(401).json({ message: 'Invalid answer.' });
        } else {
            const reportedAnswerDetails = await reportedAnswerData.findOne({ answer: answerId });
            if (reportedAnswerDetails) {
                const isUserReported = reportedAnswerDetails.reportedBy.some((reportedBy) => reportedBy.userId.toString() === userId.toString());
                if (isUserReported) {
                    return res.status(409).json({ message: 'Answer is already reported by this user.' });
                } else {
                    reportedAnswerDetails.reportedBy.push({ userId, reason: req.body.reason });
                    await reportedAnswerDetails.save();
                    return res.status(200).json({ message: 'Answer successfully reported.' });
                }
            } else {
                const newReportedAnswer = new reportedAnswerData({
                    author: answerDetails.author,  //Author of the answer not the user reporting
                    answer: answerId,
                    reportedBy: [{ userId, reason: req.body.reason }],
                });
                await newReportedAnswer.save();
                return res.status(200).json({ message: 'Answer successfully reported.' });
            }
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const userAnswersData = async (req, res) => {
    try {
        const userId = req.userId;

        const answersData = await answerData.aggregate([
            {
                $match: {
                    author: new ObjectId(userId),
                }
            },
            {
                $sort: { _id: -1 }
            }
        ]);
        return res.status(200).json({ message: 'Answerss data of user is sended.', answersData });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const editAnswer = async (req, res) => {
    try {
        const userId = req.userId;
        const inputData = req.body.inputData;
        const answerId = req.body.answerId;
        //Need to get the answer from 'answers' that matching userId and answerId(_id)
        const data = await answerData.findById(answerId);

        if (!data) {
            return res.status(404).json({ message: 'Answer not found' });
        } else if (!data.author == userId) {
            return res.status(401).json({ error: "Unauthorized: You do not have access to edit this answer." });
        }
        data.answer = inputData;
        const saved = await data.save();
        return res.status(200).json({ message: 'Answer edited successfully' });
    } catch (err) {
        console.log(err.message);
        return err.status(500).json({ message: 'Internal server error.' });
    }
}

const deleteAnswer = async (req, res) => {
    try {
        const userId = req.userId;
        const { answerId } = req.body;

        // Find the answer and its corresponding question
        const answer = await answerData.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: 'Requested answer not found.', status: 'Not found.' });
        }

        // Check if the user is authorized to delete the answer
        if (!answer.author.equals(userId)) {
            return res.status(401).json({ message: 'Unauthorized: You do not have access to edit this answer.', status: 'Unauthorized' });
        }

        // Delete the answer and remove its reference from the corresponding question
        await answerData.deleteOne({ _id: answerId });
        await questionData.updateOne({ _id: answer.question }, { $pull: { answers: answerId } });

        return res.status(200).json({ message: 'Answer deleted successfully.', status: 'Success.' });
    } catch (err) {
        console.error('Error deleting answer:', err);
        return res.status(500).json({ message: "Internal server error.", status: 'Failed.' });
    }
}

const savedAnswersData = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userData.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const savedAnswerIds = user.savedAnswers;
        const savedAnswers = await answerData.find({ _id: { $in: savedAnswerIds } })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .populate('author', 'name userName');
        return res.status(200).json({ message: 'Successfully got saved answers data.', savedAnswersData: savedAnswers });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error." });
    }
}


module.exports = {
    addAnswer,
    answersDataGet,
    answerSave,
    answerVote,
    reportAnswer,
    userAnswersData,
    editAnswer,
    deleteAnswer,
    answerUnsave,
    savedAnswersData,
};