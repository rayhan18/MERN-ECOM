const express = require('express');
const router = express.Router();
const {createUser, loginUserCrt, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout} = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../midelwares/authMidelware');



router.post('/register', createUser )
router.post('/login', loginUserCrt )
router.get('/all-users', getAllUsers )
router.get('/refresh',handleRefreshToken )
router.get('/logout',logout )

router.get('/:id', authMiddleware, isAdmin, getUser )
router.delete('/:id', deleteUser )
router.put('/edit-user',authMiddleware, updateUser )
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser )
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser )


module.exports = router;