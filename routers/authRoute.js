const express = require('express');
const router = express.Router();
const {createUser, loginUserCrt} = require('../controllers/userController')



router.post('/register', createUser )
router.post('/login', loginUserCrt )

module.exports = router;