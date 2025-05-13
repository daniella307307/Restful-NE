const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken=(userId,role)=>{
    return jwt.sign({userId,role},process.env.JWT_SECRET,{expiresIn:'1h'});
}

module.exports={
    generateToken
}