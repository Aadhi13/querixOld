const router = require('express').Router();
const userAuth = require('../middlewares/userAuth');

const signinSignupController = require('../controllers/userControllers/signin&signup');
const userController = require('../controllers/userControllers/userController');
const questionController = require('../controllers/userControllers/questionController');
const forgotPasswordController = require('../controllers/userControllers/forgotPasswordController');
const answerController = require('../controllers/userControllers/answerController');
const commentController = require('../controllers/userControllers/commentController');

//Account
router.get('/user-data', userAuth, userController.userDataGet);  //Get user data from jwt token.
router.put('/edit-profile', userAuth, userController.editProfile)  //To edit user profile.
router.get('/dashboard-data', userAuth, userController.dashboardDataGet)  //Get user related data for displaying in account dashboard.
router.get('/statistics-data', userAuth, userController.statisticsDataGet);  //For the chart in Account page.
router.get('/user-questions-data', userAuth, userController.userQuestionsData);  //For My questions section in Account page.
router.get('/user-answers-data', userAuth, answerController.userAnswersData);  //For my Answers section in Account page.
router.get('/user-comments-data', userAuth, commentController.userCommentsData);  //For my Comments section in Account page.
router.get('/user-saved-questions-data', userAuth, questionController.savedQuestionsData)  //For saved Questions section in account page
router.get('/user-saved-answers-data', userAuth, answerController.savedAnswersData)  //For saved Questions section in account page

//Login & Register
router.post('/signup', signinSignupController.userSignup);  //Sign up post request to create user account and send otp to verification.
router.post('/otp-verify', signinSignupController.otpVerify);  //Email verification through otp.
router.post('/otp-resend', signinSignupController.otpResend);  //Resend otp for email verification.
router.post('/signin', signinSignupController.userSignin);  //Sign in post request to login to existing account.
router.post('/signin-google', signinSignupController.userSigninGoogle);  //For sign in with google/ sign up with google button.

//Password
router.post('/forgot-password', forgotPasswordController.otpSend);  //Forgot password.
router.post('/forgot-password/otp-resend', forgotPasswordController.otpResend);  //OTP resend in forgot password/OTP verify page.
router.post('/forgot-password/otp-verify', forgotPasswordController.otpVerify);  //OTP verify in forgot password.
router.put('/forgot-password/new-password', userAuth, forgotPasswordController.newPassword);  //New password updating in forgot password.

//Question
router.post('/add-question', userAuth, questionController.addQuestion);  //Add new questions to the world.
router.get('/questions-data', questionController.questionsDataGet);  //Get questions data to show in home page.
router.get('/question-data/:questionId', questionController.questionDataGet); //Get single question data to show in question single page.
router.put('/question-vote', userAuth, questionController.questionVote);  //To vote(upVote and downVote) questions.
router.put('/question-save', userAuth, questionController.questionSave);  //Save questions to profile / Bookmark questions.
router.put('/question-unsave', userAuth, questionController.questionUnsave);  //Unsave questions to profile / Bookmark questions.
router.put('/edit-question', userAuth, questionController.editQuestion)  //Edit user posted question by user.
router.delete('/delete-question', userAuth, questionController.delteQuestion)  //To delete a question by user for user.

//Answer
router.post('/add-answer', userAuth, answerController.addAnswer);  //To Add new answers to questions.
router.get('/answers-data', answerController.answersDataGet);  //To display in single question page.
router.put('/answer-save', userAuth, answerController.answerSave);  //To save/Bookmark a answer to profile.
router.put('/answer-unsave', userAuth, answerController.answerUnsave);  //Unsave answers to profile / Bookmark questions.
router.put('/answer-vote', userAuth, answerController.answerVote); //To vote(upVote and downVote) answers.
router.put('/edit-answer', userAuth, answerController.editAnswer)  //Edit user posted answer by user.
router.delete('/delete-answer', userAuth, answerController.deleteAnswer) //To delete a answer by user for user.

//Comment
router.post('/add-comment', userAuth, commentController.addComment);  //To add new comments to/about questions.
router.get('/comments-data', commentController.commentsDataGet);  //For displaying in single question page.
router.put('/edit-comment', userAuth, commentController.editComment)  //Edit user posted comment by user.
router.delete('/delete-comment', userAuth, commentController.deleteComment) //To delete a comment by user for user.

//Report
router.post('/report-question', userAuth, questionController.reportQuestion); //To report question.
router.post('/report-answer', userAuth, answerController.reportAnswer); //To report answer.
router.post('/report-comment', userAuth, commentController.reportComment); //To report comment.

module.exports = router;