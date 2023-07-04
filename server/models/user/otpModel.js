const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("userOtps", otpSchema);
