const bcrypt = require("bcrypt");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

function comparePassword(raw, hash) {
  return bcrypt.compareSync(raw, hash);
}

function hashOtp(otp) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(otp, salt);
}

function compareOtp(raw, hash) {
  return bcrypt.compareSync(raw, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
  hashOtp,
  compareOtp,
};
