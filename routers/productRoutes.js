
const express = require('express');
const {createProduct, getProduct,getAllProducts, updateProduct, deleteProduct, addToWishlist, ratings, uploadImages } = require('../controllers/productController');
const { isAdmin, authMiddleware } = require('../midelwares/authMidelware');
const { uploadPhoto, productImgResize } = require('../midelwares/uploadimages');
const router = express.Router();

router.post("/", authMiddleware,isAdmin, createProduct)
router.put("/upload/:id", authMiddleware,isAdmin, uploadPhoto.array("images", 10),productImgResize, uploadImages)
router.get("/:id", getProduct)

router.put("/rating", authMiddleware, ratings)
router.put("/wishlist", authMiddleware,addToWishlist)

router.put("/:id", authMiddleware,isAdmin,updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProducts)

module.exports = router;
