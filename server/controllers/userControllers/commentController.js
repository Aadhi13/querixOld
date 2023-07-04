const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
const commentData = require("../../models/user/commentModel");
const ObjectId = mongoose.Types.ObjectId

const addComment = async (req, res) => {
    try {
        const userId = req.userId;
        const { input, questionId } = req.body;
        const userDetails = await userData.findById(userId);
        const questionDetails = await questionData.findById(questionId);
        if (!userDetails) {
            return res.status(401).json({ message: 'No user found.' });
        } else if (!input) {
            //Change below HTTP status code to proper one (Missing information/request. Invalid request. Request is not complete. Data is missing in request)
            return res.status(400).json({ message: 'Comment is not complete.' });
        } else if (!questionData) {
            return res.status(401).json({ message: 'Invalid question.' });
        }
        const comment = await commentData.create({
            author: userId,
            comment: input,
            question: questionId
        });
        await questionDetails.updateOne({ $push: { comments: comment._id } });
        return res.status(200).json({ message: 'Comment submitted.' });
    } catch (err) {

    }
}

const commentsDataGet = async (req, res) => {
    try {
        console.log('req.query.page', req.query.page)
        const { page, questionId } = req.query;
        const perPage = 4;
        const skipCount = perPage * page;
        const question = await questionData.findById(questionId).select('comments');
        const commentsData = await commentData
            .find({ _id: { $in: question.comments } })
            .skip(skipCount)
            .limit(perPage)
            .populate('author', 'userName name')
            .sort({ _id: -1 });
        const commentsCount = question.comments.length;
        return res.status(200).json({ message: 'Comments data sent', commentsData, commentsCount });
    } catch (err) {
        console.log(err.message);
    }
}



module.exports = {
    addComment,
    commentsDataGet
};