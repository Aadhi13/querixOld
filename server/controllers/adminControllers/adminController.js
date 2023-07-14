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
}

module.exports = {
    adminDataGet,
    documentsCountGet,
};