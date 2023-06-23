
const express = require('express');
const {createProduct, getProduct,getAllProducts, updateProduct, deleteProduct, addToWishlist, ratings } = require('../controllers/productController');
const { isAdmin, authMiddleware } = require('../midelwares/authMidelware');
const router = express.Router();

router.post("/", authMiddleware,isAdmin, createProduct)
router.get("/:id", getProduct)

router.put("/wishlist", authMiddleware,addToWishlist)
router.put("/rating", authMiddleware, ratings)

router.put("/:id", authMiddleware,isAdmin,updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProducts)

module.exports = router;
