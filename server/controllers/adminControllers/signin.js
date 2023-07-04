require('dotenv/config');
const adminData = require('../../models/admin/adminModel');
const { comparePassword } = require('../../util/helpers');
const jwt = require("jsonwebtoken");
const adminSignin = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const adminDetails = await adminData.findOne({ email });
        console.log(adminDetails, 'adminDetails')
        if (adminDetails) {
            const match = await comparePassword(password, adminDetails.password);
            console.log(match)
            if (match) {
                const accessToken = jwt.sign({ id: adminDetails._id }, process.env.JWT_SECRET, { expiresIn: '1800s' });
                return res.status(201).json({ message: 'Access Token is created.', accessToken });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    adminSignin
};