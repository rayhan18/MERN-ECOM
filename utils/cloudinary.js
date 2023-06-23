const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
})

// cloudinary.config({ 
//     cloud_name: 'discubuie', 
//     api_key: '511919288372889', 
//     api_secret: 'BiVzuJASxZJUogxSNS_hUFhXFUI' 
//   });
const cloudinaryUploadImg = async(fileToUploads)=>{
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUploads, (result)=>{
            resolve(
              {  url: result.SECRET_url},
              {resource_type:'auto'}
            )
        })
    })
}

module.exports = cloudinaryUploadImg;

