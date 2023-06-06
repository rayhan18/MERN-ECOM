
const {default:mongoose} = require('mongoose');

const dbConnect = ()=>{
    try{
        const connect = mongoose.connect(process.env.DB_CONNECTION_URI ,
            { useNewUrlParser: true, 
               
            });
        
        console.log('database connected successfully');
    }catch(err){
        console.error(err.message);
    }
   
}
module.exports = dbConnect;