import Joi from "joi";

const updateUserVal = Joi.object({
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

  role: Joi.string()
    .valid("admin", "cashier", "inventory")
    .optional()
    .messages({
      "any.only": "Role must be either admin, user, or manager",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const idParamVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid user ID format",
    "string.length": "Invalid user ID format",
  }),
});

export { updateUserVal, idParamVal };
