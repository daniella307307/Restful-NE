const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const userSchema= require('../schemas/User.schema');
const {generateToken} =require('../utils/jwtUtil');
const emailUtil = require('../utils/emailUtil');
/**
 * Register a new user
 */

const register = async(req,res)=>{
    try {
        //validate request body
        const {error,value} = userSchema.registerSchema.validate(req.body);
        if(error){
            return res.status(400).json({error:error.details[0].message});
        }
        //find if the email exists
        if(await User.emailExists(value.email)){
            return res.status(409).json({error:"Email already in use"});
        }
        //hash password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(value.password,salt);
        //create a new user in the database
        const userId = await User.create({
            name:value.name,
            email:value.email,
            password:hashedPassword,
            role:value.role || "user"
        });
        const token = generateToken(userId,value.role);
        res.status(201).json({
            id:userId,
            name:value.name,
            email:value.email,
            role:value.role,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Server error during reistration'});
    }
}
/**
 * Login user
 */

const login= async(req,res)=>{
    try {
        //validation
        const {error,value}= userSchema.loginSchema.validate(req.body);
        if(error){
            return res.status(400).json({error:error.details[0].message});
        }
        //Find user by email
        const user = await User.findbyEmailOrName(value.identifier);
        if(!user){
            return res.status(401).json({error:'Invalid credentials'});
        }
        //compare password
        const isMatch= await bcrypt.compare(value.password,user.password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid credentials"});
        }
        //Generate token
        const token = generateToken(user.id,user.role);
        res.status(201).json({
            id:user.id,
            email:user.email,
            name:user.name,
            role:user.role,
            token,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Server error during login"})
    }
}
/**
 * Update user
 */

const update = async (req,res)=>{
  try {
    const {error,value} = userSchema.updateUserSchema.validate(req.body);
    if(error){
        return res.status(401).json({error:error.details[0].message});
    }
    //check for fields being updated
    if(value.email){
        const existingUser = await User.findByEmail(value.email);
        if(existingUser && existingUser.id !== req.user.userId){
           return res.status(409).json({error:"Email already in use"});
        };
    };
    //prepare update data
    const updateData = {
        name: value.name,
        email:value.email,
    }
    await User.update(req.user.userId,updateData);

    const updatedUser = await User.findById(req.user.userId);
    const {password,...safeUser} = updatedUser;
    res.status(200).json(safeUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({error:"Server error during updating"});
  }
}
const updateWithPassword = async(req,res)=>{
   try {
    const {error,value} = userSchema.updateUserSchemaWithPassword.validate(req.body);
    if(error){
        return res.status(401).json({error:error.details[0].message});
    }
    //check for fields being updated
    if(value.email){
        const existingUser = await User.findByEmail(value.email);
        if(existingUser && existingUser.id !== req.user.userId){
           return res.status(409).json({error:"Email already in use"});
        };
    };
    //prepare update data
    const updateData = {
        name: value.name,
        email:value.email,
    }
    // 4. Optional: Handle password update separately
      if (value.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(value.password, salt);
      }
    await User.update(req.user.userId,updateData);
    
    const updatedUser = await User.findById(req.user.userId);
    const {password,...safeUser} = updatedUser;
    res.status(200).json(safeUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({error:"Server error during updating"});
  } 
}
const resetPassword=async(req,res)=>{
    try {
        const {error,value} = userSchema.passwordResetSchema.validate(req.body);
        if(error){
            return res.status(401).json({error:error.details[0].message});
        }
        const salt =await bcrypt.genSalt(10);
        const password=await bcrypt.hash(value.newPassword,salt)
        await User.updatePassword(password);
        res.status(200).json({message:"Password reset successfully"});
    } catch (error) {
        res.status(500).json({error:`Internal server error ${error}`})
    }
}

const getAllUsers = async(req,res)=>{
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { users, pagination } = await User.getAllPaginated(page, limit);
    res.json({ users, pagination });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
const deleteUser = async (req, res) => {
  try {
    const userId = req.query.id; // expecting ?id=123

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // Delete the user
    const result = await User.delete(userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found or already deleted" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error during deletion" });
  }
};


module.exports={
    register,
    login,
    update,
    updateWithPassword,
    resetPassword,
    getAllUsers,
    deleteUser
}