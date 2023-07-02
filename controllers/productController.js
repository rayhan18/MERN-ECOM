const  Product =require('../models/productsModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const User = require('../models/userModels')
const validateMongoDbId = require('../utils/validateMongodbId')
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinary')
const fs = require('fs')
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
    validateMongoDbId(id);
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

     //pagination
     const page = req.query.page
     const limit = req.query.limit
     const skip = (page - 1) * limit
     query = query.skip(skip).limit(limit)
     if(req.query.page){
      const productCount = await Product.countDocuments()
      if(skip >= productCount)throw new Error("this page dose not exist")
     }
     console.log(page, limit ,skip)

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

//wishlist add
const addToWishlist = asyncHandler(async(req, res) => {
  const  {_id}  = req.User;
  const {productId} = req.body
  //const productIdString = productId.toString();
  console.log(_id)
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === productId);

    if (alreadyAdded) {
    let user =  await User.findByIdAndUpdate(_id, {
        $pull: { wishlist: productId },
      }, { new: true });
      res.json(user);
    } else {
     let user = await User.findByIdAndUpdate(_id, {
        $push: { wishlist: productId },
      }, { new: true });
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});


const ratings = asyncHandler(async(req, res) =>{
   const {_id} = req.user;
   //console.log(_id)
   const {star, productId ,comment} = req.body;
   //console.log(productId ,star);
   try {
    const product = await Product.findById(productId);
    let alreadyRatings =  product.ratings.find(
      (userId) =>userId.postedBy.toString() === _id.toString()
    )
    console.log(alreadyRatings);
    if(alreadyRatings){
      const updateRatings = await Product.updateOne(
       {
        ratings:{$elemMatch: alreadyRatings}
       },
       {
        $set:{"ratings.$.star":star, "ratings.$.comment":comment}
       },
       {new:true}
      )
     // res.json(updateRatings);
    }else{
      const rateProduct = await Product.findByIdAndUpdate(productId, {
        $push: { 
          ratings:{
            star:star ,
            comment:comment,
            postedBy: _id
          }
        }
      },
      {new: true}
      )
     // res.json(rateProduct)
    }

    const gatAllRatings = await Product.findById(productId);
    let totalRating =gatAllRatings.ratings.length
    let ratingSum = gatAllRatings.ratings.map((item)=>item.star)
    .reduce((prev, cur)=>prev + cur , 0)
    let actualRatings = Math.round(ratingSum / totalRating);
   let finalProduct = await Product.findByIdAndUpdate(productId, {
      totalRating: actualRatings
    },
    {new:true}
    )
    res.json(finalProduct);
   } catch (error) {
     throw new Error(error);
   }
    
})

//upload images
const uploadImages = asyncHandler(async(req, res) => {
  
  // const {id}=req.params
  // validateMongoDbId(id)
  // console.log(req.files,'upload')
  try{
    const uploader =(path)=>cloudinaryUploadImg(path, "images")
    const urls = []
    const files =req.files
    
    for (let file of files){
      const{path} = file
      let newpath = await uploader(path)
     // console.log(newpath)
      urls.push(newpath)
      fs.unlinkSync(path)
    }
   const images = urls.map((file)=>{
    return file
  })
  res.json(images);
    // let findProduct =await Product.findByIdAndUpdate(
    //   id,
    //   {
    //     images:urls.map((file)=>{
    //       return file
    //     })
    //   },
    //   {new:true,}
    // )
    // res.json(findProduct)
   // console.log(findProduct)
  }catch(error){
    throw new Error(error)
  }

})

const deleteImages = asyncHandler(async(req, res) => {
  const {id} =req.params
  try{
    const deleteImg =(path)=>cloudinaryDeleteImg(id, "images")
    res.json({messsage: "Images deleted"})
    

  }catch(error){
    throw new Error(error)
  }

})
module.exports ={
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishlist,
    ratings,
    uploadImages,
    deleteImages 

};