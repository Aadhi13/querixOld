const router = require('express').Router();
const adminAuth = require('../middlewares/adminAuth');

const signinController = require('../controllers/adminControllers/signinController');
const adminController = require('../controllers/adminControllers/adminController');
const questionController = require('../controllers/adminControllers/questionController');
const userController = require('../controllers/adminControllers/userController');

router.get('/admin-data', adminAuth, adminController.adminDataGet); //Get admin data from jwt token
router.get('/documents-count', adminAuth, adminController.documentsCountGet);
router.get('/statistics-data', adminAuth, adminController.statisticsDataGet);
router.get('/trending-data', adminAuth, adminController.trendingDataGet)

router.post('/signin', signinController.adminSignin);

router.get('/questions-data', adminAuth, questionController.questionsDataGet);
router.put('/block-question/:questionId', adminAuth, questionController.questionBlock);
router.put('/unblock-question/:questionId', adminAuth, questionController.questionUnBlock);

router.get('/users-data', adminAuth, userController.usersDataGet);
router.put('/block-user/:userId', adminAuth, userController.userBlock);
router.put('/unblock-user/:userId', adminAuth, userController.userUnBlock);


module.exports = router;