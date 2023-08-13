require('dotenv/config');
const adminData = require('../../models/admin/adminModel');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
const commentData = require("../../models/user/commentModel")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const adminDataGet = async (req, res) => {
    try {
        const adminId = req.adminId;
        const data = await adminData.findById(adminId, { name: 1, email: 1 });
        return res.status(200).json({ message: 'Got admin Data', data });
    } catch (err) {
        if (err.message === 'invalid token') {
            return res.status(401).json({ message: 'Invalid jwt token.' });
        } else if (err.message === 'jwt expired') {
            return res.status(401).json({ message: 'Jwt expired.' });
        }
    }
};

const documentsCountGet = async (req, res) => {
    try {
        const usersCount = await userData.countDocuments();
        const questionsCount = await questionData.countDocuments();
        const answersCount = await answerData.countDocuments();
        const commentsCount = await commentData.countDocuments();
        return res.status(200).json({ message: 'Got collections count', usersCount, questionsCount, answersCount, commentsCount });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const statisticsDataGet = async (req, res) => {
    try {
        // Get the number of days to go back from the query parameter (default to 7 if not provided)
        const numOfDays = parseInt(req.query.days) || 7;

        const today = new Date();
        today.setHours(23, 59, 59, 999); // Set the time to the end of the day
        const daysAgo = new Date(today);
        daysAgo.setDate(daysAgo.getDate() - numOfDays + 1);
        daysAgo.setHours(0, 0, 0, 0); // Set the time to the beginning of the day


        // Function to format date as 'dd/mm/yyyy'
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // Initialize the data array with objects for all the specified number of days
        const data = [];
        for (let i = 0; i < numOfDays; i++) {
            const date = new Date(daysAgo);
            date.setDate(date.getDate() + i);
            const formattedDate = formatDate(date); // Function to format date as 'dd/mm/yyyy'
            data.push({
                name: formattedDate,
                questions: 0,
                answers: 0,
                users: 0,
                comments: 0,
            });
        }

        // MongoDB aggregation pipeline to calculate questions count for the specified number of days
        const questionsData = await questionData.aggregate([
            {
                $match: {
                    createdAt: { $gte: daysAgo, $lte: today } // Filter questions for the specified number of days
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } }, // Format date as 'dd/mm/yyyy'
                    questions: { $sum: 1 }, // Count questions for each day
                }
            },
            {
                $sort: { _id: 1 } // Sort the result by date in ascending order
            }
        ]);

        // MongoDB aggregation pipeline to calculate answers count for the specified number of days
        const answersData = await answerData.aggregate([
            {
                $match: {
                    createdAt: { $gte: daysAgo, $lte: today } // Filter answers for the specified number of days
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } }, // Format date as 'dd/mm/yyyy'
                    answers: { $sum: 1 }, // Count answers for each day
                }
            },
            {
                $sort: { _id: 1 } // Sort the result by date in ascending order
            }
        ]);

        // MongoDB aggregation pipeline to calculate users count for the specified number of days
        const usersData = await userData.aggregate([
            {
                $match: {
                    createdAt: { $gte: daysAgo, $lte: today } // Filter users for the specified number of days
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } }, // Format date as 'dd/mm/yyyy'
                    users: { $sum: 1 }, // Count users for each day
                }
            },
            {
                $sort: { _id: 1 } // Sort the result by date in ascending order
            }
        ]);

        // MongoDB aggregation pipeline to calculate comments count for the specified number of days
        const commentsData = await commentData.aggregate([
            {
                $match: {
                    createdAt: { $gte: daysAgo, $lte: today } // Filter comments for the specified number of days
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } }, // Format date as 'dd/mm/yyyy'
                    comments: { $sum: 1 }, // Count comments for each day
                }
            },
            {
                $sort: { _id: 1 } // Sort the result by date in ascending order
            }
        ]);


        // Update the data array with actual questions, answers, comments and answers count
        questionsData.forEach((q) => {
            const index = data.findIndex((item) => item.name === q._id);
            if (index !== -1) {
                data[index].questions = q.questions;
            }
        });

        answersData.forEach((a) => {
            const index = data.findIndex((item) => item.name === a._id);
            if (index !== -1) {
                data[index].answers = a.answers;
            }
        });

        commentsData.forEach((c) => {
            const index = data.findIndex((item) => item.name === c._id);
            if (index !== -1) {
                data[index].comments = c.comments;
            }
        });

        usersData.forEach((u) => {
            const index = data.findIndex((item) => item.name === u._id);
            if (index !== -1) {
                data[index].users = u.users;
            }
        });

        return res.status(200).json({ message: 'Statistics data sended.', data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const trendingDataGet = async (req, res) => {
    try {
        const trendingMostVoted = await questionData
            .find({ blockStatus: false })
            .sort({ "votes.upVote.count": -1 })
            .limit(2);

        const trendingMostDownVoted = await questionData
            .find({ blockStatus: false })
            .sort({ "votes.downVote.count": -1 })
            .limit(1);

        const trendingMostAnswered = await questionData
            .find({ blockStatus: false })
            .sort({ "answers.length": -1 })
            .limit(1);

        const trendingMostCommented = await questionData
            .find({ blockStatus: false })
            .sort({ "comments.length": -1 })
            .limit(1);

        const trendingQuestions = [
            ...trendingMostVoted,
            ...trendingMostDownVoted,
            ...trendingMostAnswered,
            ...trendingMostCommented
        ];

        return res.status(200).json({ message: 'Trending data is sended.', trendingData: trendingQuestions });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = {
    adminDataGet,
    documentsCountGet,
    statisticsDataGet,
    trendingDataGet,
};