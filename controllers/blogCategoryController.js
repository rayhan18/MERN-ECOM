const Category =require('../models/blogCategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')


//create category controller
const createCategory = asyncHandler(async (req, res) => {
 try {
    const newCategory = await Category.create(req.body)
    res.json(newCategory)
 } catch (error) {
     throw new Error(error)
 }
})
//update category controller
const updateCategory = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body,{
        new: true
    })
    res.json(updateCategory)
 } catch (error) {
     throw new Error(error)
 }
})

//update category controller
const deleteCategory = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const delCategory = await Category.findByIdAndDelete(id )
    res.json(delCategory)
 } catch (error) {
     throw new Error(error)
 }
})

//get category
const getCategory = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const getCategory = await Category.findById(id)
    res.json(getCategory)
 } catch (error) {
     throw new Error(error)
 }
})
//get all category
const getAllCategory = asyncHandler(async (req, res) => {
   
 try {
    const getAllCategory = await Category.find()
    res.json(getAllCategory)
 } catch (error) {
     throw new Error(error)
 }
})
module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
};