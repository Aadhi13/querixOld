require('dotenv/config');
const userData = require('../../models/user/userModel');
const mongoose = require("mongoose");
const userOtpData = require('../../models/user/otpModel');
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.OAUTH_WEB_CLIENT_ID);

const {
    hashPassword,
    comparePassword,
    hashOtp,
    compareOtp,
} = require("../../util/helpers");
const { sendOtpVerificationMail } = require('../../util/otpMailer');

const userSignup = async (req, res) => {
    try {
        const { userName, name, email, password } = req.body;
        const userExist = await userData.findOne({ email });
        if (userExist) {
            return res.status(409).json({ message: 'User Exist' })
        } else {
            const hashedPassword = hashPassword(password)
            const user = await userData.create({
                userName,
                name,
                email,
                password: hashedPassword
            });
            const data = await user.save()
            try {
                await sendOtpVerificationMail(data, req, res);
                const { expiresAt } = await userOtpData.findOne({ email }) || {};
                return res.status(200).json({ message: 'Request is received', expiresAt });
            } catch (err) {
                return res.status(500).json({ message: 'Something went wrong.' });
            }
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' })
    }
};


const otpVerify = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const userOtp = await userOtpData.findOne({ email });
        const userDetails = await userData.findOne({ email });
        if (userDetails.verifyStatus) {
            return res.status(200).json({ message: 'Email is already verified.' });
        } else {
            if (Date.now() > userOtp.expiresAt) {
                return res.status(408).json({ message: 'OTP is expired.' });
            } else {
                const isValid = compareOtp(otp, userOtp.otp);
                if (!isValid) {
                    return res.status(401).json({ message: 'OTP is not valid.' });
                } else {
                    await userData.findOneAndUpdate({ email }, { verifyStatus: true });
                    await userOtpData.findOneAndDelete({ email });
                    return res.status(200).json({ message: 'OTP is correct, email verified.' });
                }
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
            await sendOtpVerificationMail(data, req, res);
            const { expiresAt } = await userOtpData.findOne({ email }) || {};
            return res.status(200).json({ message: 'Request is received', expiresAt });
        } catch (err) {
            return res.status(500).json({ message: 'Something went wrong.' });
        }
    } catch (err) {
        console.log(err.message);
    }
}

const userSignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await userData.findOne({ email });
        if (userDetails) {
            if (userDetails.blockStatus == true) return res.status(403).json({ message: 'Access Denied: Your account has been suspended.' });
            if (userDetails.verifyStatus == false) {
                try {
                    const data = { _id: userDetails._id, name: userDetails.name, email: userDetails.email };
                    await userOtpData.findOneAndDelete({ email });
                    await sendOtpVerificationMail(data, req, res);
                    const { expiresAt } = await userOtpData.findOne({ email }) || {};
                    return res.status(200).json({ message: 'User is not verified, OTP sended to mail.', expiresAt });
                } catch (err) {
                    return res.status(500).json({ message: 'Something went wrong.' });
                }
            }
            const match = await comparePassword(password, userDetails.password);
            if (match) {
                const accessToken = jwt.sign({ id: userDetails._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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


const userSigninGoogle = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ message: 'No jwt token.' })
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_WEB_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name, sub } = payload;
        const userExist = await userData.findOne({ email });
        if (userExist) {
            const userDetails = await userData.findOne({ email });
            const accessToken = jwt.sign({ id: userDetails._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(201).json({ message: 'Access Token is created.', accessToken });
        } else {
            const userName = name.replace(/\s/g, '').toLowerCase() + sub.toString().substr(6, 6);
            const user = await userData.create({
                userName,
                name,
                email,
                verifyStatus: true
            });
            user.save()
            const userDetails = await userData.findOne({ email });
            const accessToken = jwt.sign({ id: userDetails._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(201).json({ message: 'Access Token is created.', accessToken });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong.' });
    }
}

module.exports = {
    userSignup,
    otpVerify,
    otpResend,
    userSignin,
    userSigninGoogle
};