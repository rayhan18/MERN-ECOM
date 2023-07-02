const express = require('express');
const router = express.Router();
const {createUser, loginUserCrt, getAllUsers, getUser, deleteUser, 
    updateUser, blockUser, unblockUser, handleRefreshToken, logout,
     updateUserPassword, forgotPasswordToken, resetPassword, loginAdminCrt, 
     getWishlist, saveAddress, userCart, getUserCart,
      emptyCart, applyCoupon, createOrder, getOrder, getOrders, updatedOrderStatus, } = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../midelwares/authMidelware');



router.post('/register', createUser )
router.put('/password',authMiddleware, updateUserPassword )
router.post('/forget-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/order/update-order/:id', authMiddleware, isAdmin, updatedOrderStatus)
router.post('/login', loginUserCrt )
router.post('/admin-login', loginAdminCrt )
router.post('/cart',authMiddleware, userCart )
router.post('/cart/applycoupon',authMiddleware, applyCoupon )
router.post('/cart/cash-order',authMiddleware, createOrder )

router.get('/all-users', getAllUsers )
router.get('/get-orders', authMiddleware, getOrders )

router.get('/refresh',handleRefreshToken )
router.get('/logout',logout )
router.get('/wishlist', authMiddleware,  getWishlist )
router.get('/cart', authMiddleware,  getUserCart )

router.get('/:id', authMiddleware, isAdmin, getUser )
router.delete("/empty-cart", authMiddleware, emptyCart)
router.delete('/:id', deleteUser )
router.put('/edit-user',authMiddleware, updateUser )
router.put('/save-address',authMiddleware, saveAddress )
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser )
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser )


module.exports = router;