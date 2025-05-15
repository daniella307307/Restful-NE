const joi = require("joi");

const bookingSchema = joi.object({
    plateNumber:joi.string().required().messages({
           "string.plateNumber":"Invalid plate format"
       }),
       userId:joi.number().required().messages({
           "number.userId":"Valid format for the user id"
       }),
       start_time:joi.date().required(),
       end_time:joi.date().required()
})

module.exports={
    bookingSchema
}