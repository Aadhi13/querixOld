require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'No jwt token.' })
        const decode = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        if (!decode) return res.status(401).json({ message: 'Invalid jwt token.' });
        if (decode.exp * 1000 < Date.now()) {
            return res.status(401).json({ message: 'Jwt expired.' });
        }
        const adminId = decode.id;
        req.adminId = adminId
        next()
    } catch (err) {
        if (err.message === 'invalid token') {
            return res.status(401).json({ message: 'Invalid jwt token.' });
        } else if (err.message === 'jwt expired' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Jwt expired.' });
        } else {
            return res.status(401).json({
                message: 'Invalid jwt token.',
                spMessage: 'Error might be not related to ivalid jwt token.'
            });
        }
    }
}

module.exports = auth;