const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");


const questionsDataGet = async (req, res) => {
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
        console.log('req.query.page', req.query.page);
        console.log('req.query.limit', req.query.limit);
        const { page, limit } = req.query;
        const questionsData = await questionData.find()
            .skip(limit * page)
            .limit(limit)
            .sort({ _id: -1 })
        const questionsCount = await questionData.countDocuments();
        return res.status(200).json({ message: 'Questions data sended', questionsData, questionsCount });
    } catch (err) {
        console.log(err.message);
    }

}


module.exports = {
    questionsDataGet
};