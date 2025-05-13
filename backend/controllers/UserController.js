const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const userSchema= require('../schemas/User.schema');
const {generateToken} =require('../utils/jwtUtil');
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

module.exports={
    register,
    login
}