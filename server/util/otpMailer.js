require("dotenv").config();
const userOtpData = require("../models/user/otpModel");

const nodemailer = require("nodemailer");
const { hashOtp, compareOtp } = require("./helpers");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

const sendOtpVerificationMail = async ({ _id, email, name }, req, res) => {
  return new Promise(async (resolve, reject) => {
    try {

      function generateOtp() {
        let otp = '';
        while (otp.length < 6) {
          const array = new Uint8Array(3); // 3 bytes = 24 bits
          crypto.getRandomValues(array);
          const randomBits = (array[0] << 16) | (array[1] << 8) | array[2];
          otp = (randomBits % 1000000).toString(); // 6 digi
        }
        return otp;
      }
      // Generate a true random OTP using crypto.getRandomValues() for enhanced security
      const otp = generateOtp();

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "OTP for Querix registration.",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Querix</a>
                        </div>
                        <p style="font-size:1.1em">Hi, <b>${name}</b></p>
                        <p>Thank you for choosing Querix. Use the following OTP to complete your Sign Up procedures. OTP is valid for 3 minutes.</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                        <p style="font-size:0.9em;">Regards,<br />Querix</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>Querix Lmt</p>
                            <p>1600 Amphitheatre Parkway</p>
                            <p>California</p>
                        </div>
                    </div>
                </div>`,
      };

      await userOtpData.deleteMany({ email: email});
      const hashedOtp = hashOtp(otp);
      const newOtpVerification = new userOtpData({
        userId: _id,
        email: email,
        otp: hashedOtp,
        expiresAt: Date.now() + 180000,  //3 minutes
      });
      await newOtpVerification.save();
      await transporter.sendMail(mailOptions);
      resolve();
    } catch (err) {
      console.error(err);
      console.log('insdie catch err of otpmailer')
      reject(err);
    }
  });
};

module.exports = {
  sendOtpVerificationMail,
};
