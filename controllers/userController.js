
const User = require('../models/userModels');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtToken');
const validateMongodbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshtoken');

//create user model
const createUser = asyncHandler(
    async (req,res) =>{
        const email = req.body.email
        const findUser = await User.findOne({ email: email})
        if(!findUser) {
            //create new user
            const newUser = await User.create(req.body)
            res.json(newUser)
        }else{
           throw new Error('User already exists')
        
        }
    }
)
//login user
const loginUserCrt = asyncHandler(async (req,res) =>{
    const {email, password} = req.body;
    //console.log(email,password)
    const findUser = await User.findOne({ email: email})
    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updatedUser = await User.findOneAndUpdate(findUser.id,{
            refreshToken: refreshToken,
        }, {new: true})
        res.cookie('refreshToken', refreshToken ,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    } else{
        throw new Error('invalid Credentials')
    }
    
})
//get all users
const getAllUsers = asyncHandler(async (req,res) =>{
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error )
    }
})
//get single user
const getUser = asyncHandler(async (req,res) =>{
    const {id} = req.params
    validateMongodbId(id)
    try {
        const getSingleUser = await User.findById(id)
        res.json({getSingleUser})
    } catch (error) {
        throw new Error(error)
    }
})
//update user
const updateUser = asyncHandler(async (req,res) =>{
    const {_id} = req.user
    validateMongodbId(_id)
    try {
        const updateUserData = await User.findByIdAndUpdate(
            _id,{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile: req.body.mobile,
        },
          {
            new:true
        } 
        )
     res.json(updateUserData)
    } catch (error) {
        throw new Error(error)
    }
})
//delete single user
const deleteUser = asyncHandler(async (req,res) =>{
    const {id} = req.params
    validateMongodbId(id)
    try {
        const delSingleUser = await User.findByIdAndDelete(id)
        res.json({delSingleUser})
    } catch (error) {
        throw new Error(error)
    }
})
//block user
const blockUser = asyncHandler(async (req,res) =>{
  const {id} = req.params
  validateMongodbId(id)
  try {
    const block= await User.findByIdAndUpdate(id,
        {isBlocked: true,},
        {new: true}
    )
    //res.send(block)
    res.json({
        message:"User Blocked"
    })
  } catch (error) {
    throw new Error(error)
  }
})

//unblock user
const unblockUser = asyncHandler(async (req,res) =>{
    const {id} = req.params
    validateMongodbId(id)
    try {
      const unBlock = await User.findByIdAndUpdate(id,
          {isBlocked: false,},
          {new: true}
      )
      res.json({
        message:"User unBlocked"
    })
    } catch (error) {
      throw new Error(error)
    }
})
module.exports = {
    createUser,
    loginUserCrt,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser
};