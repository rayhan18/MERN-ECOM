const express = require('express');
const router = express.Router();
const {createUser, loginUserCrt, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updateUserPassword, forgotPasswordToken, resetPassword, loginAdminCrt, getWishlist, saveAddress} = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../midelwares/authMidelware');



router.post('/register', createUser )
router.put('/password',authMiddleware, updateUserPassword )
router.post('/forget-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.post('/login', loginUserCrt )
router.post('/admin-login', loginAdminCrt )
router.get('/all-users', getAllUsers )
router.get('/refresh',handleRefreshToken )
router.get('/logout',logout )
router.get('/wishlist', authMiddleware,  getWishlist )

router.get('/:id', authMiddleware, isAdmin, getUser )
router.delete('/:id', deleteUser )
router.put('/edit-user',authMiddleware, updateUser )
router.put('/save-address',authMiddleware, saveAddress )
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser )
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser )


module.exports = router;