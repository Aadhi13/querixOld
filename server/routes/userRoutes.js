const router = require('express').Router();
const userAuth = require('../middlewares/userAuth');

const signinSignupController = require('../controllers/userControllers/signin&signup');
const authController = require('../controllers/userControllers/authController');
const questionController = require('../controllers/userControllers/questionController');
const forgotPasswordController = require('../controllers/userControllers/forgotPasswordController');
const answerController = require('../controllers/userControllers/answerController');

router.get('/user-data', userAuth, authController.userDataGet); //Get user data from jwt token

router.post('/signup', signinSignupController.userSignup); //Sign up post request to create user account and send otp to verification
router.post('/otp-verify', signinSignupController.otpVerify); //Email verification through otp
router.post('/otp-resend', signinSignupController.otpResend); //Resend otp for email verification
router.post('/signin', signinSignupController.userSignin); //Sign in post request to login to existing account 
router.post('/signin-google', signinSignupController.userSigninGoogle);

router.post('/forgot-password', forgotPasswordController.otpSend);
router.post('/forgot-password/otp-resend', forgotPasswordController.otpResend);
router.post('/forgot-password/otp-verify', forgotPasswordController.otpVerify);
router.put('/forgot-password/new-password', userAuth, forgotPasswordController.newPassword);

router.post('/add-question', userAuth, questionController.addQuestion);
router.get('/questions-data', questionController.questionsDataGet); //Get questions data to show in home page
router.get('/question-data/:questionId', questionController.questionDataGet); //Get single question data to show in question single page
router.put('/question-vote', userAuth, questionController.questionVote); //To vote(upVote and downVote) questions
router.put('/question-save', userAuth, questionController.questionSave);

router.post('/add-answer', userAuth, answerController.addAnswer);
router.get('/answers-data', answerController.answersDataGet );
router.put('/answer-save', userAuth, answerController.answerSave);
router.put('/answer-vote', userAuth, answerController.answerVote); //To vote(upVote and downVote) answers 

module.exports = router;