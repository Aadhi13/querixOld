const router = require('express').Router();
const {
    userSignup,
    signupGet,
    otpVerify,
    otpResend,
    userSignin
} = require('../controllers/userControllers/signin&signup.js');
const { userDataGet } = require('../controllers/userControllers/authController.js');
const { addQuestion } = require('../controllers/userControllers/questionController.js');

router.post('/signup', userSignup) //Sign up post request to create user account and send otp to verification
router.get('/signup', signupGet)
router.post('/otp-verify', otpVerify) //Email verification through otp
router.post('/otp-resend', otpResend) //Resend otp for email verification
router.post('/signin', userSignin) //Sign in post request to login to existing account 

router.get('/users/:jwtToken', userDataGet); //Get user data from jwt token

router.post('/add-question', addQuestion)

module.exports = router;