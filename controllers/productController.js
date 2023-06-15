const  Product =require('../models/productsModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')


//create product
const createProduct = asyncHandler(async (req, res ) => {
  if(req.body.title){
    req.body.slug = slugify(req.body.title)
  }
  try {
    const newProduct = await Product.create(req.body);
   res.json(newProduct);
  } catch (error) {
    throw new Error(error)
  }
  
})
//update product
const updateProduct = asyncHandler(async (req, res ) => {
  const {id} = req.params
  try {
    if(req.body.title){
      req.body.slug = slugify(req.body.title)
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body,{
      new: true
    })
    res.json(updateProduct)
  } catch (error) {
    throw new Error(error)
  }
})
//delete product
const deleteProduct = asyncHandler(async (req, res ) => {
  const {id} = req.params
  try {
    
    const deleteProduct = await Product.findByIdAndDelete(id)
    res.json(deleteProduct)
  } catch (error) {
    throw new Error(error)
  }
})
//get a products
const getProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
      const findSingleProduct = await Product.findById(id)
      res.json(findSingleProduct)
   } catch (error) {
     throw new Error(error)
   }
   
}) 
//get all products
const getAllProducts = asyncHandler(async (req, res)=>{
  //console.log(req.query)
  try {
    //filtering product
    const queryObj ={...req.query}
    const excludeField =["page", "sort", "limit", "fields"]
     excludeField.forEach(el => delete queryObj[el] )
   // console.log(queryObj,req.query)
     //console.log(queryObj)
let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match)=>`$${match}`)
    //console.log(JSON.parse(queryStr))
    let query =Product.find(JSON.parse(queryStr))

    //sorting product
    if(req.query.sort){
      let sortBy =req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    }else{
      query = query.sort("-createdAt")
    }

    //limiting fields
     if(req.query.fields){
      const fields = req.query.fields.split("," ).join(" ")
      query = query.select(fields)
     }else{
      query = query.select()
     }
    const products = await query
   //const findAllProducts = await Product.find(queryObj)
    // const findAllProducts = await Product.where("category").equals(
    //   req.query.category
    // )
     
    res.json(products)
  } catch (error) {
    throw new Error(error)
  }
});
module.exports ={
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
};