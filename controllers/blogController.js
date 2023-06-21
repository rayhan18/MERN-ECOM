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
    try {
      const singleBlog = await Blog.findById(id)
      await Blog.findByIdAndUpdate(id,{
        $inc:{numViews:1},
      },
       {new: true}
      )
      res.json(singleBlog)
    } catch (error) {
      throw new Error(error)
    }
  })
module.exports = {
    createBlog,
    updateBlog,
    getBlog
};