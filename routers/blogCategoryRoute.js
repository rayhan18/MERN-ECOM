const express = require('express');
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require('../controllers/blogCategoryController');
const { authMiddleware, isAdmin } = require('../midelwares/authMidelware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createCategory)
router.put('/:id',authMiddleware,isAdmin,updateCategory )
router.delete('/:id',authMiddleware,isAdmin, deleteCategory)
router.get('/:id',getCategory)
router.get('/',getAllCategory)



module.exports = router;