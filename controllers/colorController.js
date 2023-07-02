const Color =require('../models/colorModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')


//create color controller
const createColor = asyncHandler(async (req, res) => {
 try {
    const newColor = await Color.create(req.body)
    res.json(newColor)
 } catch (error) {
     throw new Error(error)
 }
})
//update Color controller
const updateColor = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const updateColor = await Color.findByIdAndUpdate(id, req.body,{
        new: true
    })
    res.json(updateColor)
 } catch (error) {
     throw new Error(error)
 }
})

//update Color controller
const deleteColor = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const delColor = await Color.findByIdAndDelete(id )
    res.json(delColor)
 } catch (error) {
     throw new Error(error)
 }
})

//get Color
const getColor = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const getColor = await Color.findById(id)
    res.json(getColor)
 } catch (error) {
     throw new Error(error)
 }
})
//get all Color
const getAllColor = asyncHandler(async (req, res) => {
   
 try {
    const getAllColor = await Color.find()
    res.json(getAllColor)
 } catch (error) {
     throw new Error(error)
 }
})
module.exports = {
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getAllColor
};