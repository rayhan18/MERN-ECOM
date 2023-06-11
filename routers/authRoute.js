const express = require('express');
const router = express.Router();
const {createUser, loginUserCrt, getAllUsers, getUser, deleteUser, updateUser} = require('../controllers/userController');
const {authMiddleware} = require('../midelwares/authMidelware');



router.post('/register', createUser )
router.post('/login', loginUserCrt )
router.get('/all-users', getAllUsers )
router.get('/:id', authMiddleware, getUser )
router.delete('/:id', deleteUser )
router.put('/:id', updateUser )

module.exports = router;