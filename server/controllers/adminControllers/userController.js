const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");


const usersDataGet = async (req, res) => {
    try {
        // questionData.aggregate([
        //     {
        //         $lookup: {
        //             from: "comments",
        //             let: { question: "$_id" },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $eq: ["$question", "$$question"],
        //                         },
        //                     },
        //                 },
        //                 {
        //                     $project: {
        //                         _id: 1,
        //                         Comment: 1,
        //                         created_at: 1,
        //                     },
        //                 },
        //             ],
        //             as: "comments",
        //         },
        //     },
        //     {
        //         $lookup: {
        //             from: "answers",
        //             let: { question: "$_id" },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $eq: ["$question", "$$question"],
        //                         },
        //                     },
        //                 },
        //                 {
        //                     $project: {
        //                         _id: 1,
        //                     },
        //                 },
        //             ],
        //             as: "answerDetails",
        //         },
        //     },
        //     {
        //         $project: {
        //             __v: 0,
        //         },
        //     },
        // ])
        //     .exec()
        //     .then((questionDetails) => {
        //         res.status(200).send(questionDetails);
        //     })
        //     .catch((e) => {
        //         console.log(e);
        //         res.status(400).send(e);
        //     });

        // console.log('req.query.page', req.query.page);
        // console.log('req.query.limit', req.query.limit);
        // const { page, limit } = req.query;

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