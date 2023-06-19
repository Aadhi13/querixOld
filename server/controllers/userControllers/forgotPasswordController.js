require('dotenv/config');
const userOtpData = require('../../models/user/otpModel');
const userData = require('../../models/user/userModel');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { collection } = require('../../models/user/questionModel');
const {
    compareOtp, hashPassword,
} = require("../../util/helpers");
const { sendOtpForgotPasswordMail } = require('../../util/otpMailer');

const otpSend = async (req, res) => {
    try {
        const { email } = req.body
        const userDetails = await userData.findOne({ email });
        if (!userDetails) {
            return res.status(404).json({ message: 'Invalid email.' }); //User is not exist in this email.
        } else {
            try {
                const data = { _id: userDetails._id, name: userDetails.name, email: userDetails.email };
                await userOtpData.findOneAndDelete({ email });
                await sendOtpForgotPasswordMail(data, req, res);
                const { expiresAt } = await userOtpData.findOne({ email }) || {};
                return res.status(200).json({ message: 'OTP sended to mail.', expiresAt });
            } catch (err) {
                return res.status(500).json({ message: 'Something went wrong.' });
            }
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const otpResend = async (req, res) => {
    try {
        const { email } = req.body;
        const userDetails = await userData.findOne({ email });
        const data = { _id: userDetails._id, name: userDetails.name, email: userDetails.email };
        await userOtpData.findOneAndDelete({ email });
        try {
            await sendOtpForgotPasswordMail(data, req, res);
            const { expiresAt } = await userOtpData.findOne({ email }) || {};
            return res.status(200).json({ message: 'Request is received', expiresAt });
        } catch (err) {
            return res.status(500).json({ message: 'Something went wrong.' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const otpVerify = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const userOtp = await userOtpData.findOne({ email });
        const userDetails = await userData.findOne({ email });
        if (Date.now() > userOtp.expiresAt) {
            return res.status(408).json({ message: 'OTP is expired.' });
        } else {
            const isValid = compareOtp(otp, userOtp.otp);
            if (!isValid) {
                return res.status(401).json({ message: 'OTP is not valid.' });
            } else {
                const accessToken = jwt.sign({ id: userDetails._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
                await userOtpData.findOneAndDelete({ email });
                return res.status(200).json({ message: 'OTP is correct, email verified.', accessToken });
            }
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const newPassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { password } = req.body;
        const userDetails = await userData.findById({ _id: userId });
        if (!userDetails) {
            return res.status(404).json({ message: 'Invalid user.' });
        } else {
            const hashedPassword = await hashPassword(password)
            await userDetails.updateOne({ password: hashedPassword });
            await userDetails.save();
            return res.status(200).json({ message: 'Password updated.' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' })
    }
}

module.exports = {
    otpSend,
    otpResend,
    otpVerify,
    newPassword
}