import Joi from "joi";

const updateValProfile = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid user ID format",
    "string.length": "Invalid user ID format",
  }),
  name: Joi.string().min(2).max(50).trim().optional().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const changePasswordVal = Joi.object({
  password: Joi.string()
    .required()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .messages({
      "string.pattern.base":
        "old Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    }),
  newPassword: Joi.string()
    .required()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .messages({
      "string.pattern.base":
        "new Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    }),
});

export { updateValProfile, changePasswordVal };
