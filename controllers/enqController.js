const Enquiry =require('../models/enqModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')


//create Enquiry controller
const createEnquiry = asyncHandler(async (req, res) => {
 try {
    const newEnquiry = await Enquiry.create(req.body)
    res.json(newEnquiry)
 } catch (error) {
     throw new Error(error)
 }
})
//update Enquiry controller
const updateEnquiry = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body,{
        new: true
    })
    res.json(updateEnquiry)
 } catch (error) {
     throw new Error(error)
 }
})

//update Enquiry controller
const deleteEnquiry = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const delEnquiry = await Enquiry.findByIdAndDelete(id )
    res.json(delEnquiry)
 } catch (error) {
     throw new Error(error)
 }
})

//get Enquiry
const getEnquiry = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongodbId(id)
 try {
    const getEnquiry = await Enquiry.findById(id)
    res.json(getEnquiry)
 } catch (error) {
     throw new Error(error)
 }
})
//get all Enquiry
const getAllEnquiry = asyncHandler(async (req, res) => {
   
 try {
    const getAllEnquiry = await Enquiry.find()
    res.json(getAllEnquiry)
 } catch (error) {
     throw new Error(error)
 }
})
module.exports = {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiry
};