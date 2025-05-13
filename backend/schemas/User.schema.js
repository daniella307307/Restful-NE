const joi = require("joi");
// user registration schema

const registerSchema = joi.object({
  name: joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
  }),
  password: joi
    .string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must include uppercase and lowercase letters and numbers",
      "string.empty": "Password is required",
    }),
  role: joi.string().valid("admin", "manager", "user").default("user"),
});

//user Login schema

const loginSchema = joi.object({
  identifier: joi.string().required().messages({
    "string.empty": "email or name is required",
  }),
  password: joi.string().required(),
});

// Update user schema (no password)
const updateUserSchema = joi
  .object({
    name: joi.string().min(3).max(30),
    email: joi.string().email(),
  })
  .min(1); // At least one field is required

const passwordResetSchema = joi.object({
  token: joi.string().required(),
  newPassword: joi.string().min(8).required(),
  confirmPassword: joi.string()
    .valid(joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
    }),
});
module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
};
