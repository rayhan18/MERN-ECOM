
const dotenv = require('dotenv').config();

const {default:mongoose} = require('mongoose');

// CLOUD_NAME='discubuie'
// API_KEY='511919288372889'
// SECRET_KEY='BiVzuJASxZJUogxSNS_hUFhXFUI'
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