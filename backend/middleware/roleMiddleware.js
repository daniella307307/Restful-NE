const User = require('../models/User.model');

//middleware to restrict access by role
const requireRole =(allowedRoles)=>{
    return async(req,res,next)=>{
        const userId = req.user.id;
        const userRole= await User.getRole(userId);
        if(!allowedRoles.includes(userRole)){
            return res.status(403).json({error:"Access denied"})
        }
        next();
    };
};

// Example usage: Protect a route to admins only
// router.get('/admin', requireRole(['admin']), adminController.dashboard);

module.exports = {requireRole};