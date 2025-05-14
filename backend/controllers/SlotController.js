const Slot = require('../models/Slot.model');
const User = require('../models/User.model');
const {createSlotSchema} = require('../schemas/Slot.schema')
const createSlot= async (req,res)=>{
    try {
        const {error,value}= createSlotSchema.validate(req.body);
        if(error){
            return res.status(400).json({error:error.details[0].message});
        }
        const user = User.findById(value.userId);
        if(!user){
            return res.status(400).json({
                error:"User not found"
            })
        }
        await Slot.createSlot({userId:value.userId, plateNumber:value.plateNumber,slotStatus:value.slotStatus});
        return res.status(200).json({message:"new Slot provided successfully"});
    } catch (error) {
        return res.status(500).json({error:`Error during slot creation ${error}`});
    }
}
const getAllSlots = async(req,res)=>{
    try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { slots, pagination } = await Slot.getAllPaginated(page, limit);
    res.json({slots, pagination });
  } catch (err) {
    res.status(500).json({ error: `Server error ${err}`});
  }
}
module.exports={
    createSlot,
    getAllSlots
}