
const dotenv = require('dotenv').config();

const {default:mongoose} = require('mongoose');


const dbConnect = async()=>{
    try{
        await mongoose.connect( process.env.DB_CONNECTION_URI,
            { useNewUrlParser: true, 
                useUnifiedTopology: true,
               
            });
        
        console.log('database connected successfully');
    }catch(err){
        console.error(err.message);
    }
   
}
module.exports = dbConnect;