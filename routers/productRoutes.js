
const express = require('express');
const {createProduct, getProduct,getAllProducts, updateProduct, deleteProduct, addToWishlist, ratings, uploadImages, deleteImages } = require('../controllers/productController');
const { isAdmin, authMiddleware } = require('../midelwares/authMidelware');
const { uploadPhoto, productImgResize } = require('../midelwares/uploadimages');
const router = express.Router();

router.post("/", authMiddleware,isAdmin, createProduct)
router.put("/upload/", authMiddleware,isAdmin, uploadPhoto.array("images", 10),productImgResize, uploadImages)
router.get("/:id", getProduct)
router.put("/wishlist", authMiddleware,addToWishlist)

router.put("/rating", authMiddleware, ratings)

router.put("/:id", authMiddleware,isAdmin,updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages)
router.get("/", getAllProducts)

module.exports = router;
