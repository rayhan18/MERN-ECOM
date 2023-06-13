const jwt = require('jsonwebtoken')

const generateToken =(id)=>{
return jwt.sign({id},  process.env.jwt_SECRET_KEY ,{expiresIn:'1d'})
}

module.exports = generateToken;