
const User = require('../models/userModels');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const Products = require('../models/productsModel');
const Cart = require('../models/cartModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtToken');
const validateMongodbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');
 const crypto = require('crypto');
 var uniqid = require('uniqid'); 

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
        const updatedUser = await User.findOneAndUpdate(findUser._id,{
            refreshToken: refreshToken,
        }, {new: true})
        //set cookie
        res.cookie('refreshToken', refreshToken ,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000, //3days
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

//login admin
const loginAdminCrt = asyncHandler(async (req,res) =>{
    const {email, password} = req.body;
    //console.log(email,password)
    const findAdmin = await User.findOne({ email: email})
    if(findAdmin?.role !== "admin" ) throw new Error('Not Authorized')
    if(findAdmin && (await findAdmin.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const updatedAdmin = await User.findOneAndUpdate(findAdmin._id,{
            refreshToken: refreshToken,
        }, {new: true})
        //set cookie
        res.cookie('refreshToken', refreshToken ,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000, //3days
        })
        res.json({
            _id: findAdmin?._id,
            firstName: findAdmin?.firstName,
            lastName: findAdmin?.lastName,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        })
    } else{
        throw new Error('invalid Credentials')
    }
    
})
//handle refresh token
const handleRefreshToken = asyncHandler(async (req,res) =>{
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error('No refresh token in cookie')
    const refreshToken = cookie.refreshToken;
    //console.log(refreshToken)
    const user = await User.findOne({refreshToken: refreshToken})
    if(!user) throw new Error('No Refresh token in user')
    jwt.verify(refreshToken, process.env.jwt_SECRET_KEY,(err,decoded) => {
        //console.log(decoded)
        if(err || user.id !== decoded.id){
            throw new Error('There is something wrong with the refresh token')
        } 
        const accessToken =  generateToken(user?._id)
        res.json({accessToken})
    })
    //res.json(user)
})
//logout function
const logout = asyncHandler(async (req,res) =>{
  const cookie = req.cookies 
  if(!cookie?.refreshToken) throw new Error('No refresh token in cookie')
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({refreshToken: refreshToken})
  if(!user) {
    res.clearCookie('refreshToken',{
        httpOnly: true,
        secure: true
    })
     res.sendStatus(204)//forbidden
  }
  await User.findOneAndUpdate({
    refreshToken: " ",
  })
  res.clearCookie('refreshToken',{
    httpOnly: true,
    secure: true
})
 res.sendStatus(204)//forbidden
})

//save user address
const saveAddress = asyncHandler(async (req,res) =>{
    const {_id} = req.user
    validateMongodbId(_id)
    try {
        const saveUserData = await User.findByIdAndUpdate(
            _id,{
            address: req?.body?.address,
           
        },
          {
            new:true
        } 
        )
     res.json(saveUserData)
    } catch (error) {
        throw new Error(error)
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

//update password
const updateUserPassword = asyncHandler(async (req,res) => {
   // console.log(req.body)
 const {_id} = req.user
 const {password} = req.body
 validateMongodbId(_id)
 const user = await User.findById(_id)
 if(password){
    user.password = password
    const updatePassword = await user.save()
    res.send(updatePassword)
 }else{
    res.json(user)
 }
})

//forget password token generator+
const forgotPasswordToken = asyncHandler(async (req, res ,next) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if (!user) throw new Error("User not found with this email");
    try {
      let token = await user.createPasswordResetToken();
    
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://127.0.0.1:5000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
    
     await sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
    
  });

  //reset password
  const resetPassword =asyncHandler(async (req, res) => {
    const {password} = req.body
    const {token} = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires:{$gt:Date.now()},
    })
    if(!user) throw new Error("Token expired trying to reset your password");
     user.password = password;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     await user.save();
     res.json(user);
  })

  //get wishlist
  const getWishlist = asyncHandler(async (req, res) => {
    const {_id} = req.user
    try {
        const findUser = await User.findById(_id).populate('wishlist')
        res.json(findUser) 
    } catch (error) {
        throw new Error(error);
    }

  })

//   const userCart = asyncHandler(async (req, res) =>{
//     const {cart} = req.body
//     const {_id} = req.user
//     validateMongodbId(_id)
//     try {
//         let products =[]
//         const user = await User.findById(_id)
//         //check if user already have product in cart
//         const alreadyExistsCart  = await Cart.findOne({orderby:user._id});
//         if(alreadyExistsCart){
//             alreadyExistsCart.remove()
//         }
//         for(let i = 0; i < cart.length; i++){
//             let object ={}
//             object.product = cart[i]._id
//             object.count = cart[i].count
//             object.color = cart[i].color
//             let getPrice = await Product.findById(cart[i]._id).select('price')
//             .exec()
//             object.price = getPrice.price
//             products.push(object)
//         }
//         console.log(products)
//     } catch (error) {
//         throw new Error(error);
//     }
   

//   })
// user cart [error req.user id not found]
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const  {_id}  = req.user;
    // console.log(req.user._id ,"id")
     validateMongodbId(_id);
    try{
      let products = [];
      const user = await User.findById(_id);
      // check if user already have product in cart
      const alreadyExistCart = await Cart.findOne({ orderby: user._id });
      if (alreadyExistCart) {
        alreadyExistCart.remove();
      }
      for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let getPrice = await Products.findById(cart[i]._id).select("price").exec();
        object.price = getPrice.price;
        products.push(object);
      }
      console.log(products)
    
      let cartTotal = 0;
      for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
      }
      let newCart = await new Cart({
        products,
        cartTotal,
        orderby: user?._id,
      }).save();
      res.json(newCart);
} catch (error) {
    throw new Error(error);
}
  });

  //get user cart
  const getUserCart = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    try {
        const cart = await Cart.findOne({orderby: _id}).populate("products.product");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
  })

  const emptyCart = asyncHandler(async (req,res) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    try {
        const user = await User.findOne({_id})
        const Cart = await Cart.findOneAndRemove({orderby: user._id})
        res.json(Cart);
    } catch (error) {
        throw new Error(error);
    }
  });

  const applyCoupon = asyncHandler(async (req,res) => {
    const {coupon} = req.body;
    const {_id} = req.user;
    validateMongodbId(_id);
     const validCoupon = await Coupon.findOne({name:coupon})
     if(validCoupon === null) {
        throw new Error("Coupon not found");
     }
     const user = await User.findOne({_id});
     let {product, cartTotal } = await Cart.findOne({orderby: user._id}).populate("products.product");
     let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100
     ).toFixed(2);
     await Cart.findOneAndUpdate({orderby: user._id},
        {totalAfterDiscount},{new: true}
        )
        res.json(totalAfterDiscount)  
  })

  const createOrder = asyncHandler(async (req,res) => {
    const {COD ,couponApplied} = req.body
    const {_id} = req.user
    validateMongodbId(_id)
    console.log(req.body ,'body')
    try {
        if(!COD) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({orderby: user._id})
        let finalAmount  = 0
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount 
        }else{
            finalAmount = userCart.cartTotal 
        }

        let newOrder = await new Order({
            products:userCart.products,
            paymentIntent:{
                id:uniqid(),
                method:"COD",
                amount:finalAmount,
                status: "cash on delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby:user._id,
            orderStatus:"Cash on Delivery",
        }).save()
        let update = userCart.products.map((item)=>{
            return {
                updateOne:{
                     filter:{_id: item.product._id},
                     update:{ $inc:{quantity: -item.count, sold: +item.count}}
                }
            }
        })
        const updated =await Products.bulkWrite(update,{})
        res.json({message:"Success"})
    } catch (error) {
        throw new Error(error)
    }
  })

  const getOrders = asyncHandler(async(req,res) => {
    const {_id} = req.user
    validateMongodbId(_id)
    try {
        const userOrders = await Order.findOne({orderby:_id })
        .populate(Products.product)
        .populate("orderby").exec()
        res.json(userOrders)
    } catch (error) {
        throw new Error(error)
    }
  })

  const getAllOrders = asyncHandler(async(req,res) => {
    try {
        const allUserOrders = await Order.find()
        .populate(Products.product)
        .populate("orderby").exec()
        res.json(allUserOrders)
    } catch (error) {
        throw new Error(error)
    }
  })
  const updatedOrderStatus = asyncHandler(async(req,res) => {
     const {status} = req.body
     const {id} = req.params
     validateMongodbId(id)
     const foundOrder = await Order.findByIdAndUpdate(id,{
        orderStatus:status,
        paymentIntent:{
            status:status,
        }
     },
     {new:true}
     )
     res.json(foundOrder)
  })
module.exports = {
    createUser,
    loginUserCrt,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updateUserPassword,
    forgotPasswordToken,
    resetPassword,
    loginAdminCrt,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updatedOrderStatus,
    getAllOrders
};