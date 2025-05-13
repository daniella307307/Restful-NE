const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * Verify JWT token - Authentication
 */

const requireAuth = async (req,res,next)=>{
 try {
    const token = req.header("Authorization").split(' ')[1];
    if(!token){
        return res.status(401).json({error:"authentication required"});
    }
    //verify token
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    //attach user to a request
    const user = await User.findById(decoded.userId);
    if(!user){
        return res.status(401).json({error:"User not found"});
    }
    req.user={
        userId:user.id,
        role:user.role,
        email:user.email
    };
    next();
 } catch (error) {
    console.error('Auth error:', error.message);
    if(error.name === "TokenExpiredError"){
        return res.status(401).json({error:'Token expired'})
    }
    if(error.name === 'JsonWebTokeError'){
        return res.status(401).json({error:'Invalid token'});
    }
    res.status(500).json({error:"Authentication failed"});
 }
}

/**
 * Role-Based Access Control
 */

const requiredRole = (roles)=>{
    return(req,res,next)=>{
        if(!roles.include(req.user.role)){
            return res.status(403).json({
                error:`Access denied .required roles:[${roles.join(',')}]`
            })
        }
        next();
    }
}

/**
 * 3. Optional: Self-action or Admin restriction
 * (User can only modify their own data unless admin)
 */
const requireOwnershipOrAdmin = (model) => {
  return async (req, res, next) => {
    const resource = await model.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Allow if user owns resource OR is admin
    if (resource.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

module.exports={
    requireAuth,
    requiredRole,
    requireOwnershipOrAdmin
}