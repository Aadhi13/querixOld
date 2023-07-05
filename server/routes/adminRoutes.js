const router = require('express').Router();

const signinController = require('../controllers/adminControllers/signin');

router.post('/signin', signinController.adminSignin); 

module.exports = router;