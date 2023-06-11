const jwt = require('jsonwebtoken')

const generateToken =(id)=>{
return jwt.sign({id},  process.env.jwt_SECRET_KEY ,{expiresIn:'3d'})
}

module.exports = generateToken;