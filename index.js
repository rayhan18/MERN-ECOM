
const express = require('express');
const dbConnect = require('./config/dbConection');
const app = express();
//const dotenv =require('dotenv').config();
const authRoute = require('./routers/authRoute') 
const blogRouter = require('./routers/blogRoute') 
const brandRouter = require('./routers/brandRoute')
const colorRouter = require('./routers/colorRoute')
const enqRouter = require('./routers/enqRoute')
const bodyParser = require('body-parser');   
const { notFound, errorHandler } = require('./midelwares/errorHandler');
const cookieParser = require('cookie-parser');
const productRouter = require('./routers/productRoutes');
const morgan = require('morgan');
const productCategoryRouter = require('./routers/productCategoryRoute')    
const blogCategoryRouter = require('./routers/blogCategoryRoute') 
const couponRouter = require('./routers/couponRoute')   
const PORT = process.env.PORT || 4000;



//database connection
dbConnect();

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());

app.use('/api/user' ,authRoute)
app.use('/api/product' , productRouter);
app.use('/api/blog' , blogRouter);
app.use('/api/category' , productCategoryRouter);
app.use('/api/blogcategory' , blogCategoryRouter);
app.use('/api/brand' , brandRouter);
app.use('/api/coupon' , couponRouter);
app.use('/api/color' , colorRouter);
app.use('/api/enquiry' , enqRouter);


app.use(notFound)
app.use(errorHandler)
//listen server
app.listen(PORT, () =>{
    console.log(`Express server listening on port ${PORT}.`);
});