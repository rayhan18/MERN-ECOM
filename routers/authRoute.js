const express = require('express');
const router = express.Router();
const {createUser, loginUserCrt, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser} = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../midelwares/authMidelware');



router.post('/register', createUser )
router.post('/login', loginUserCrt )
router.get('/all-users', getAllUsers )
router.get('/:id', authMiddleware, isAdmin, getUser )
router.delete('/:id', deleteUser )
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser )
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser )

module.exports = router;