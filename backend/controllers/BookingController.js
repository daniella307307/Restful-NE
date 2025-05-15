const Booking = require("../models/Booking.model");
const { bookingSchema }=require('../schemas/Book.schema')
const book=async(req,res)=>{
    try {
        const {error,value}= bookingSchema.validate(req.body);
        if(!error){
            res.status(400).json({
                "error":`Inavlid format ${error}`
            })
        }
        await Booking.book({user_id:value.user_id, slot_id:value.slot_id,start_time:value.start_time,end_time:value.end_time});
        res.status(200).json({message:"Message used successfully"});
    } catch (error) {
        res.status(500).json({error:`Internal server error ${error}`});
    }
}

module.exports={
    book
}