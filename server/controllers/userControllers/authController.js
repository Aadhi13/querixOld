require('dotenv/config');
const userData = require('../../models/user/userModel');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userDataGet = async (req, res) => {
    try {
        const accessToken = req.params.jwtToken;
        const decode = jwt.verify(accessToken, process.env.JWT_SECRET);
        if (!decode) return res.status(401).json({ message: 'Invalid jwt token.' });
        const userId = decode.id;
        const data = await userData.findById(userId, { name: 1, userName: 1, email: 1 });
        return res.status(200).json({ message: 'Got user Data', data});
    } catch (err) {
        console.log(err.message);
        if (err.message === 'invalid token') {
            return res.status(401).json({ message: 'Invalid jwt token.'});
        } else if (err.message === 'jwt expired') {
            return res.status(401).json({message: 'Jwt expired.'});
        }
    }
};

module.exports = {
    userDataGet
};