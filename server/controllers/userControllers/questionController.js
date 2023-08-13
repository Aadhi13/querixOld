const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
const reportedQuestionData = require("../../models/user/reportedQuestionModel");
const ObjectId = mongoose.Types.ObjectId

const addQuestion = async (req, res) => {
    try {
        const userId = req.userId;
        const { input, tags } = req.body;
        const data = await userData.findById(userId, { name: 1, userName: 1, email: 1 });
        if (!data) {
            return res.status(401).json({ message: 'No user found.' });
        } else if (!input.body || !input.title) {
            //Change below HTTP status code to proper one (Missing information/request. Invalid request. Request is not complete. Data is missing in request)
            return res.status(400).json({ message: 'Queston is not complete.' });
        }
        await questionData.create({
            userId: data._id,
            question: input,
            tags
        })
        return res.status(200).json({ message: 'Question submitted.' });
    } catch (err) {
        console.log(err.message);
    }
};


const questionsDataGet = async (req, res) => {
    try {
        console.log('req.query.page', req.query.page);
        const { page } = req.query;

        const blockedQuestionCount = await questionData.countDocuments({ blockStatus: true });
        const totalQuestionCount = await questionData.countDocuments();

        const questions = await questionData
            .find({ blockStatus: { $ne: true } })
            .skip(4 * page)
            .limit(4)
            .populate('userId', 'userName name')
            .sort({ _id: -1 });

        return res.status(200).json({
            message: 'Questions data sent',
            questions,
            questionsCount: totalQuestionCount - blockedQuestionCount,
        });
    } catch (err) {
        console.log(err.message);
    }
};


const questionDataGet = async (req, res) => {
    try {
        console.log('req.params.questionId', req.params.questionId)
        const questionId = req.params.questionId
        try {
            const singleQuestionData = await questionData.findById({ _id: new ObjectId(questionId) }).populate('userId', 'userName name')
            if (singleQuestionData) {
                if (singleQuestionData.blockStatus) {
                    return res.status(404).json({ message: 'Invalid question' });
                } else {
                    return res.status(200).json({ message: 'Question data sended', singleQuestionData });
                }
            } else {
                return res.status(404).json({ message: 'Invalid question' });
            }
        } catch (err) {
            return res.status(404).json({ message: 'Invalid question' });
        }
    } catch (err) {
        console.log(err.message)
    }
}

const questionVote = async (req, res) => {
    try {
        const userId = req.userId;
        const { voteIs, questionId } = req.body;
        const question = await questionData.findById({ _id: new ObjectId(questionId) })
        console.log('\n\nVote =\n', req.body);
        if (voteIs == 'upVote') {
            if (question.votes.upVote.userId.includes(userId)) { //upVoted question >> upVote
                return res.status(304).json({ message: 'Already upVoted.' })
            } else if (question.votes.downVote.userId.includes(userId)) { //downVoted question >> upVote
                await question.updateOne({ $pull: { 'votes.downVote.userId': userId }, $inc: { 'votes.downVote.count': -1 } });
                await question.updateOne({ $push: { 'votes.upVote.userId': userId }, $inc: { 'votes.upVote.count': 1 } });
                await question.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await questionData.findById(questionId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'UpVoted question.', voteCount });
            } else {
                await question.updateOne({ $push: { 'votes.upVote.userId': userId }, $inc: { 'votes.upVote.count': 1 } });
                await question.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await questionData.findById(questionId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'UpVoted question.', voteCount });
            }
        } else if (voteIs == 'downVote') {
            if (question.votes.downVote.userId.includes(userId)) { //downVoted question >> downVote
                return res.status(304).json({ message: 'Already downVoted.' })
            } else if (question.votes.upVote.userId.includes(userId)) { //upvoted question >> downVote
                await question.updateOne({ $pull: { 'votes.upVote.userId': userId }, $inc: { 'votes.upVote.count': -1 } });
                await question.updateOne({ $push: { 'votes.downVote.userId': userId }, $inc: { 'votes.downVote.count': 1 } });
                await question.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await questionData.findById(questionId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'DownVoted question.', voteCount });
            } else {
                await question.updateOne({ $push: { 'votes.downVote.userId': userId }, $inc: { 'votes.downVote.count': 1 } });
                await question.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await questionData.findById(questionId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'DownVoted question.', voteCount });
            }
        } else if (voteIs == 'neutral') {
            if (question.votes.upVote.userId.includes(userId)) { //upVoted question >> neutral
                await question.updateOne({ $pull: { 'votes.upVote.userId': userId }, $inc: { 'votes.upVote.count': -1 } });
                await question.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await questionData.findById(questionId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'Question is neutral.', voteCount })
            } else if (question.votes.downVote.userId.includes(userId)) { //downVoted queston >> neutral
                await question.updateOne({ $pull: { 'votes.downVote.userId': userId }, $inc: { 'votes.downVote.count': -1 } });
                await question.save();
                const { votes: { upVote: { count: upVoteCount }, downVote: { count: downVoteCount } } } = await questionData.findById(questionId);
                const voteCount = upVoteCount - downVoteCount;
                return res.status(200).json({ message: 'Question is neutral.', voteCount })
            } else {
                return res.status(304).json({ message: "Question is already neutral." })
            }
        }

    } catch (err) {
        console.log(err.message);
    }
};

const questionSave = async (req, res) => {
    try {
        const { questionId } = req.body
        const userId = req.userId;
        const userDetails = await userData.findById({ _id: userId });
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found.' });
        } else {
            await userDetails.updateOne({ $push: { 'savedQuestions': questionId } });
            await userDetails.save();
            return res.status(200).json({ message: 'Question successfully saved.' })
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error." })
    }
};

const questionUnsave = async (req, res) => {
    try {
        const { questionId } = req.body
        const userId = req.userId;
        const userDetails = await userData.findById({ _id: userId });
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found.' });
        } else {
            await userDetails.updateOne({ $pull: { 'savedQuestions': questionId } });
            await userDetails.save();
            return res.status(200).json({ message: 'Question successfully unsaved.' })
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error." })
    }
};

const reportQuestion = async (req, res) => {
    try {
        const { questionId } = req.body;
        const userId = req.userId;
        const questionDetails = await questionData.findById({ _id: questionId });
        if (!questionDetails) {
            return res.status(401).json({ message: 'Invalid question.' });
        } else {
            const reportedQuestionDetails = await reportedQuestionData.findOne({ question: questionId });
            if (reportedQuestionDetails) {
                const isUserReported = reportedQuestionDetails.reportedBy.some((reportedBy) => reportedBy.userId.toString() === userId.toString());
                if (isUserReported) {
                    return res.status(409).json({ message: 'Question is already reported by this user.' });
                } else {
                    reportedQuestionDetails.reportedBy.push({ userId, reason: req.body.reason });
                    await reportedQuestionDetails.save();
                    return res.status(200).json({ message: 'Question successfully reported.' });
                }
            } else {
                const newReportedQuestion = new reportedQuestionData({
                    author: questionDetails.userId,  //Author of the question not the user reporting
                    question: questionId,
                    reportedBy: [{ userId, reason: req.body.reason }],
                });
                await newReportedQuestion.save();
                return res.status(200).json({ message: 'Question successfully reported.' });
            }
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const editQuestion = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, body, tags } = req.body.inputData;
        const question = { title: title, body: body };
        const questionId = req.body.questionId;
        //Need to get the question from 'questions' that matching userId and questionId(_id)
        const data = await questionData.findById(questionId);

        if (!data) {
            return res.status(404).json({ message: 'Question not found' });
        } else if (!data.userId == userId) {
            return res.status(401).json({ error: "Unauthorized: You do not have access to edit this question." });
        }
        data.question = question;
        data.tags = tags;
        const saved = await data.save();
        console.log(saved, 'saved');
        return res.status(200).json({ message: 'Question edited successfully' });
    } catch (err) {
        console.log(err.message);
        return err.status(500).json({ message: 'Internal server error.' });
    }
}

const delteQuestion = async (req, res) => {
    try {
        const userId = req.userId;
        const { questionId } = req.body;
        console.log(questionId, '<<<>>>', userId);
        questionData.findOne({ _id: questionId })
            .then((question) => {
                if (!question) {
                    console.log('Document not found');
                    return res.status(404).json({ message: 'Requested question not found.', status: 'Not found.' });
                }
                if (!question.userId.equals(userId)) {
                    console.log('Unauthorized: User ID does not match.');
                    return res.status(401).json({ message: 'Unauthorized: You do not have access to edit this question.', status: 'Unauthorized' });
                }
                questionData.deleteOne({ _id: questionId })
                    .then(() => {
                        console.log('Document deleted successfully');
                        return res.status(200).json({ message: 'Document deleted successfully.', status: 'Success.' });
                    })
                    .catch((error) => {
                        console.error('Error deleting document:', error);
                        return res.status(500).json({ message: "Internal server error.", status: 'Failed.' })
                    });
            })
            .catch((error) => {
                console.error('Error finding document:', error);
                return res.status(404).json({ message: 'Requested question not found.', status: 'Not found.' });
            });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error." });
    }
}


const savedQuestionsData = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userData.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const savedQuestionIds = user.savedQuestions;
        const savedQuestions = await questionData.find({ _id: { $in: savedQuestionIds } })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .populate('userId', 'name userName');
        return res.status(200).json({ message: 'Successfully got saved questions data.', savedQuestionsData: savedQuestions });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    addQuestion,
    questionsDataGet,
    questionDataGet,
    questionVote,
    questionSave,
    reportQuestion,
    editQuestion,
    delteQuestion,
    savedQuestionsData,
    questionUnsave,
};