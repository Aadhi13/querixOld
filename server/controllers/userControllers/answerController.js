const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
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
        console.log('req.query.page', req.query.page)
        const { page, questionId } = req.query;
        const perPage = 4;
        const skipCount = perPage * page;
        const question = await questionData.findById(questionId).select('answers');
        const answersData = await answerData
            .find({ _id: { $in: question.answers } })
            .skip(skipCount)
            .limit(perPage)
            .populate('author', 'userName name')
            .sort({ _id: -1 });
        const answersCount = question.answers.length;
        return res.status(200).json({ message: 'Answers data sent', answersData, answersCount });
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


module.exports = {
    addAnswer,
    answersDataGet,
    answerSave
};