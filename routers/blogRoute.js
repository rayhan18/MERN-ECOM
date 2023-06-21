const express = require('express');
const { authMiddleware, isAdmin } = require('../midelwares/authMidelware');
const { createBlog,updateBlog } = require('../controllers/blogController');
const routers = express.Router();

routers.post('/',  authMiddleware, isAdmin  ,createBlog)
routers.put('/:id',  authMiddleware, isAdmin  ,updateBlog)



module.exports = routers;