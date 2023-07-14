const router = require('express').Router();
const adminAuth = require('../middlewares/adminAuth');

const signinController = require('../controllers/adminControllers/signin');
const adminControllers = require('../controllers/adminControllers/adminController');
const questionControllers = require('../controllers/adminControllers/questionController')

router.get('/admin-data', adminAuth, adminControllers.adminDataGet); //Get admin data from jwt token
router.get('/documents-count', adminAuth, adminControllers.documentsCountGet)

router.post('/signin', signinController.adminSignin);

router.get('/questions-data', adminAuth, questionControllers.questionsDataGet)


module.exports = router;