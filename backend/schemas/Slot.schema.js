const joi = require('joi');

const createSlotSchema=joi.object({
    plateNumber:joi.string().required().messages({
        "string.plateNumber":"Invalid plate format"
    }),
    userId:joi.number().required().messages({
        "number.userId":"Valid format for the user id"
    }),
    slotStatus: joi.string().valid('available','unavailable').default("unavailable"),
});

module.exports={
    createSlotSchema
}