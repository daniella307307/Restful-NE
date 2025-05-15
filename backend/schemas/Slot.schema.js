const joi = require('joi');

const createSlotSchema=joi.object({
    plateNumber:joi.string().required().messages({
        "string.plateNumber":"Invalid plate format"
    }),
    userId:joi.number().required().messages({
        "number.userId":"create a valid user id"
    }),
    slot_status: joi.string().valid('available','unavailable').default("user"),
})

module.exports={
    createSlotSchema
}