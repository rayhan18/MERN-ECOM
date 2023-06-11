
//not found 

const notFound = (req,res,news)=>{
 const error = new Error(`not found request :${req.originalUrl}`)
 res.status(404);
 next(error)
};

//error handling
const errorHandler = (err, req,res,next)=>{
    const statuscode = (res.statusCode == 200 ? 500 : res.statusCode)
    res.status(statuscode)
    res.json({
        message: err?.message,
        stack: err?.stack,
    })
    ///next()
}

module.exports = {
    notFound,
    errorHandler,
}