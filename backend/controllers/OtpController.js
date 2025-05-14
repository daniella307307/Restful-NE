const {sendOTPEmail} = require('../utils/emailUtil');
const User = require('../models/User.model');
const { otpSchema,verifyOtpSchema } = require('../schemas/User.schema')
const otpStore ={};

const generateOTP= ()=>Math.floor(100000+Math.random()*900000).toString();

const requestOTP = async (req, res) => {
  const { error,value } =otpSchema.validate(req.body) ;
  if(error){
    return res.status(400).json({error:error.details[0].message})
  }
  const existingUser = User.findByEmail(value.email);
  if(!existingUser){
    return res.status(400).json({error:"User not found in the database"})
  }
  if (!value.email) return res.status(400).json({ error: 'Email is required' });

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore[value.email] = { otp, expiresAt };

  try {
    await sendOTPEmail(value.email, otp);
    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const verifyOTP = (req, res) => {
  const { error,value } = verifyOtpSchema.validate(req.body);
  if(error){
    return res.status(400).json({error:error.details[0].message});
  }
  
  const record = otpStore[value.email];
  if (!record) return res.status(400).json({ error: 'OTP not found or expired' });

  if (record.otp !== value.otp) return res.status(400).json({ error: 'Invalid OTP' });

  if (Date.now() > record.expiresAt) {
    delete otpStore[value.email];
    return res.status(400).json({ error: 'OTP expired' });
  }

  delete otpStore[value.email]; // Invalidate OTP after success
  res.json({ message: 'OTP verified successfully' });
};

module.exports = { requestOTP, verifyOTP };