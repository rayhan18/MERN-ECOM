
const express = require('express');
const {createProduct, getProduct,getAllProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { isAdmin, authMiddleware } = require('../midelwares/authMidelware');
const router = express.Router();

router.post("/", authMiddleware,isAdmin, createProduct)
router.get("/:id", getProduct)
router.put("/:id", authMiddleware,isAdmin,updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProducts)


module.exports = router;
