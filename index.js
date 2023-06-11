
const express = require('express');
const dbConnect = require('./config/dbConection');
const app = express();
const dotenv =require('dotenv').config();
const authRoute = require('./routers/authRoute') 
const bodyParser = require('body-parser');   
const { notFound, errorHandler } = require('./midelwares/errorHandler');
const PORT = process.env.PORT || 4000;
//https://www.youtube.com/watch?v=S6Yd5cPtXr4&t=252s
//14M 

//database connection
dbConnect();
// app.get('/', (req, res) => {
//   res.status(200).send('home page');
// })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));


app.use('/api/user' ,authRoute)
//app.use('/api/login' ,authRoute)


app.use(notFound)
app.use(errorHandler)
//listen server
app.listen(PORT, () =>{
    console.log(`Express server listening on port ${PORT}.`);
});