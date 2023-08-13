require('dotenv/config');
const mongoose = require("mongoose");
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
const commentData = require("../../models/user/commentModel");
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");

const userDataGet = async (req, res) => {
    try {
        const userId = req.userId;
        const data = await userData.findById(userId, { name: 1, userName: 1, email: 1, savedQuestions: 1, savedAnswers: 1, });
        return res.status(200).json({ message: 'Got user Data', data });
    } catch (err) {
        if (err.message === 'invalid token') {
            return res.status(401).json({ message: 'Invalid jwt token.' });
        } else if (err.message === 'jwt expired') {
            return res.status(401).json({ message: 'Jwt expired.' });
        }
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, userName } = req.body.inputData;
        console.log('name: ', name);
        console.log('userName: ', userName);
        console.log('userId: ', userId);
        const data = await userData.findById(userId, { name: 1, userName: 1, email: 1 });
        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }
        data.name = name;
        data.userName = userName;
        await data.save();
        return res.status(200).json({ message: 'Profile updated successfully' });

    } catch (err) {
        console.log(err.message);
        return err.status(500).json({ message: 'Internal server error.' });
    }
}

const dashboardDataGet = async (req, res) => {
    try {
        let totalVotes = 0;
        const userId = req.userId;

        const questionQuery = { userId };
        const answerQuery = { author: userId };
        const commentQuery = { author: userId };

        const questionsCount = await questionData.countDocuments(questionQuery);
        const answersCount = await answerData.countDocuments(answerQuery);
        const commentCount = await commentData.countDocuments(commentQuery);

        const userQuestions = await questionData.find({ userId });
        const userAnswers = await answerData.find({ author: userId });

        for (const question of userQuestions) {
            totalVotes += question.votes.upVote.userId.length - question.votes.downVote.userId.length;
        }

        for (const answer of userAnswers) {
            totalVotes += answer.votes.upVote.userId.length - answer.votes.downVote.userId.length;
        }

        return res.status(200).json({ message: 'Sended dashboard data.', questionsCount, answersCount, commentCount, totalVotes })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


const statisticsDataGet = async (req, res) => {
    try {
        const userId = req.userId;

        // Get the number of days to go back from the query parameter (default to 7 if not provided)
        const numOfDays = parseInt(req.query.days) || 10;

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
                comments: 0,
            });
        }

        // MongoDB aggregation pipeline to calculate questions count for the specified number of days
        const questionsData = await questionData.aggregate([
            {
                $match: {
                    userId: new ObjectId(userId),
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
                    author: new ObjectId(userId),
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


        // MongoDB aggregation pipeline to calculate comments count for the specified number of days
        const commentsData = await commentData.aggregate([
            {
                $match: {
                    author: new ObjectId(userId),
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

        return res.status(200).json({ message: 'Statistics data sended.', data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const userQuestionsData = async (req, res) => {
    try {
        const userId = req.userId;

        const questionsData = await questionData.aggregate([
            {
                $match: {
                    userId: new ObjectId(userId),
                }
            },
            {
                $sort: { _id: -1 }
            }
        ]);
        return res.status(200).json({ message: 'Questoins data of user is sended.', questionsData });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    userDataGet,
    editProfile,
    dashboardDataGet,
    statisticsDataGet,
    userQuestionsData,
};