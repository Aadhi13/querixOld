const router = require('express').Router();
const {
    adminSignin
} = require('../controllers/adminControllers/signin');
router.post('/signin', adminSignin); 

module.exports = router;