
const express = require('express');
const dbConnect = require('./config/dbConection');
const app = express();
const dotenv =require('dotenv').config();
const PORT = process.env.PORT || 4000;
//https://www.youtube.com/watch?v=S6Yd5cPtXr4&t=252s
//14M 

//database connection
dbConnect();

// home route
app.use('/',(req,res)=>{
    res.send('hello world');
})

//listen server
app.listen(PORT, () =>{
    console.log(`Express server listening on port ${PORT}.`);
});