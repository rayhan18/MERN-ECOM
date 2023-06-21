const Blog = require('../models/blogModels');
const User = require('../models/userModels');
const asyncHandler = require("express-async-handler");
const validateMongodbId = require('../utils/validateMongodbId');

//create blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body)
    res.json(newBlog)
  } catch (error) {
    throw new Error(error)
  }
})

//update blog
const updateBlog = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongodbId(id)
    try {
      const editBlog = await Blog.findByIdAndUpdate(id, req.body,{
        new: true
      })
      res.json(editBlog)
    } catch (error) {
      throw new Error(error)
    }
  })

  //get single blog
  const getBlog = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongodbId(id)
    try {
      const singleBlog = await Blog.findById(id)
      .populate('likes')
      .populate('dislikes')
     const updateViews = await Blog.findByIdAndUpdate(id,{
        $inc:{numViews:1},
      },
       {new: true}
      )
      res.json(singleBlog)
    } catch (error) {
      throw new Error(error)
    }
  })

  //get all blogs
  const getAllBlogs = asyncHandler(async (req,res)=>{
    try {
      const getBlogs = await Blog.find()
      res.json(getBlogs)
    } catch (error) {
      throw new Error(error)
    }
  })
  //delete blog
const deleteBlog = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongodbId(id)
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id)
    res.json(deleteBlog)
  } catch (error) {
    throw new Error(error)
  }
})
//liked blogs
const likeBlog = asyncHandler(async(req, res) =>{
  const {blogId} = req.body
  validateMongodbId(blogId)
  //find the blog witch you want to link
  const blog = await Blog.findById(blogId)
  //find the login user
   const loginUserId = req?.user?._id
//find if the user has already liked to the blog
   const isLiked =blog?.isLiked
   //find if the user has disliked the blog
 const alreadyDisliked   = blog?.dislikes?.find(
  (userId => userId?.toString() === loginUserId?.toString())
 )
 if(alreadyDisliked){
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $pull:{dislikes: loginUserId},
    isDisliked: false

  },{new: true})
  res.json(blog)
 }
 if(isLiked){
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $pull:{likes: loginUserId},
    isLiked: false

  },{new: true})
  res.json(blog)
  //liked the blog now true
 }else{
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $push:{likes: loginUserId},
    isLiked: true

  },{new: true})
  res.json(blog)
 }
})


//disliked blogs
const dislikedBlog = asyncHandler(async(req, res) =>{
  const {blogId} = req.body
  validateMongodbId(blogId)
  //find the blog witch you want to link
  const blog = await Blog.findById(blogId)
  //find the login user
   const loginUserId = req?.user?._id
//find if the user has already liked to the blog
   const isDisLiked =blog?.isDisliked
   //find if the user has disliked the blog
 const alreadyLiked   = blog?.likes?.find(
  (userId => userId?.toString() === loginUserId?.toString())
 )
 if(alreadyLiked){
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $pull:{likes: loginUserId},
    isLiked: false

  },{new: true})
  res.json(blog)
 }
 if(isDisLiked){
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $pull:{dislikes: loginUserId},
    isDisliked: false

  },{new: true})
  res.json(blog)
  //liked the blog now true
 }else{
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $push:{dislikes: loginUserId},
    isDisliked: true

  },{new: true})
  res.json(blog)
 }
})
module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikedBlog
};