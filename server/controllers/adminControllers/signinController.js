require('dotenv/config');
const adminData = require('../../models/admin/adminModel');
const { comparePassword } = require('../../util/helpers');
const jwt = require("jsonwebtoken");
const adminSignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminDetails = await adminData.findOne({ email });
        if (adminDetails) {
            const match = await comparePassword(password, adminDetails.password);
            if (match) {
                const accessToken = jwt.sign({ id: adminDetails._id }, process.env.ADMIN_JWT_SECRET, { expiresIn: '3600s' }); //30 minutes expiration time
                return res.status(201).json({ message: 'Access Token is created.', accessToken });
            } else {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' })
    }
}

module.exports = {
    adminSignin
};