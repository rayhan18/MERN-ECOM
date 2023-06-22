const Brand =require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')


//create Brand controller
const createBrand = asyncHandler(async (req, res) => {
 try {
    const newBrand = await Brand.create(req.body)
    res.json(newBrand)
 } catch (error) {
     throw new Error(error)
 }
})
//update Brand controller
const updateBrand = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body,{
        new: true
    })
    res.json(updateBrand)
 } catch (error) {
     throw new Error(error)
 }
})

//update Brand controller
const deleteBrand = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const delBrand = await Brand.findByIdAndDelete(id )
    res.json(delBrand)
 } catch (error) {
     throw new Error(error)
 }
})

//get Brand
const getBrand = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const getBrand = await Brand.findById(id)
    res.json(getBrand)
 } catch (error) {
     throw new Error(error)
 }
})
//get all Brand
const getAllBrand = asyncHandler(async (req, res) => {
   
 try {
    const getAllBrand = await Brand.find()
    res.json(getAllBrand)
 } catch (error) {
     throw new Error(error)
 }
})
module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand
};