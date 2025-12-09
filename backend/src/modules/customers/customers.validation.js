import Joi from "joi";

const addCustomerVal = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 to 15 digits",
      "string.empty": "Phone number is required",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  address: Joi.string().max(200).optional(),
  totalPurchases: Joi.number().min(0).optional().messages({
    "number.min": "Total purchases cannot be negative",
  }),
  lastPurchaseDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid date",
  }),
});

const updateCustomerVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid customer ID format",
    "string.length": "Invalid customer ID format",
  }),
  name: Joi.string().min(2).max(50).trim().optional().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be between 10 to 15 digits",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  address: Joi.string().max(200).optional(),
  totalPurchases: Joi.number().min(0).optional().messages({
    "number.min": "Total purchases cannot be negative",
  }),
  lastPurchaseDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid date",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const idParamVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid customer ID format",
    "string.length": "Invalid customer ID format",
  }),
});

export { addCustomerVal, updateCustomerVal, idParamVal };
