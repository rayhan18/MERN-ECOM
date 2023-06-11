
//const User = require('../models/userModel');
const jwt = require("jsonwebtoken")
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req,res,next)=>{
    // let token;
    // if(req?.headers?.authorization?.startsWith('Bearer')){
    //   token = req.headers.authorization.split(" ")[1]
    //   try {
    //     if(token){
    //         const decoded = jwt.verify(token, process.env.jwt_SECRET_KEY)
    //         console.log(decoded)
            
    //     }
    //   } catch (error) {
    //     throw new Error("Not authorized token expired , please login again")
    //   }
    // }else{
    //     throw new Error('there is no token attacjed to header ')
    // }
})

module.exports = {
  authMiddleware
};