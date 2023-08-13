const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");


const usersDataGet = async (req, res) => {
    try {
        const usersData = await userData.find()
            .select('-createdAt -password -savedAnswers -savedQuestions -updatedAt')
            .sort({ _id: -1 })
        // const questionsCount = await questionData.countDocuments();
        return res.status(200).json({ message: 'Users data sended', usersData });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Server error.' });
    }

}

const userBlock = async (req, res) => {
    try {
        const userId = req.params.userId;
        await userData.findByIdAndUpdate(userId, { $set: { blockStatus: true } })
        return res.status(200).json({ success: true, message: "User blocked successfully" })
    } catch (err) {
        return res.status(500).json({ message: 'Server error.'});
    }
}

const userUnBlock = async (req, res) => {
    try {
        const userId = req.params.userId;
        await userData.findByIdAndUpdate(userId, { $set: { blockStatus: false } })
        return res.status(200).json({ success: true, message: "User unblocked successfully" })
    } catch (err) {
        return res.status(500).json({ message: 'Server error.'});
    }
}


module.exports = {
    usersDataGet,
    userBlock,
    userUnBlock
};