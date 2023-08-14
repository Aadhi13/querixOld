const jwt = require('jsonwebtoken');
const userData = require("../models/user/userModel");

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'No jwt token.' })
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) return res.status(401).json({ message: 'Invalid jwt token.' });
        if (decode.exp * 1000 < Date.now()) {
            return res.status(401).json({ message: 'Jwt expired.' });
        }
        const userId = decode.id;
        const data = await userData.findById(userId);
        if (data.blockStatus) return res.status(401).json({ message: 'Jwt expired.' });
        req.userId = userId
        next()
    } catch (err) {
        if (err.message === 'invalid token') {
            return res.status(401).json({ message: 'Invalid jwt token.' });
        } else if (err.message === 'jwt expired') {
            return res.status(401).json({ message: 'Jwt expired.' });
        }
    }
}

module.exports = auth;