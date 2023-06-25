const express = require('express');
const { authMiddleware, isAdmin } = require('../midelwares/authMidelware');
const { createBlog,updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikedBlog } = require('../controllers/blogController');
const { blogImgResize, uploadPhoto } = require('../midelwares/uploadimages');
const { uploadImages } = require('../controllers/productController');
const routers = express.Router();

routers.post('/',  authMiddleware, isAdmin  ,createBlog)
routers.put('/likes',authMiddleware,likeBlog)
routers.put('/dislikes',authMiddleware,dislikedBlog)
routers.put("/upload/:id", 
authMiddleware,isAdmin, 
uploadPhoto.array("images", 2), 
blogImgResize, uploadImages)

routers.put('/:id',  authMiddleware, isAdmin  ,updateBlog)
routers.get('/:id',   getBlog)
routers.get('/',   getAllBlogs)

routers.delete('/:id',authMiddleware,isAdmin,deleteBlog)




module.exports = routers;