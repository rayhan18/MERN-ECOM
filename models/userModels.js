const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt'); // Erase if already required
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        
    },
    lastName:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user", 

    },
    cart:{ type:Array, default:[] },
    address:[{ type:mongoose.Schema.Types.ObjectId, ref:"Address", }],
    wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:"product"}],
   
},
{
    timestamps: false,
});

userSchema.pre('save', async function(req, res, next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
})
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
//Export the model
module.exports = mongoose.model('User', userSchema);


