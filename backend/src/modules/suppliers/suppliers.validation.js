import Joi from "joi";

const addSupplierVal = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    "string.empty": "Supplier name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
  company: Joi.string().min(2).max(100).trim().required().messages({
    "string.empty": "Company name is required",
    "string.min": "Company name must be at least 2 characters",
    "string.max": "Company name cannot exceed 100 characters",
  }),
  contactNumber: Joi.string()
    .pattern(/^[0-9+\-\s()]{10,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Contact number must be between 10 to 20 characters and contain only numbers, +, -, spaces, and parentheses",
      "string.empty": "Contact number is required",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  address: Joi.string().max(200).optional(),
  totalPurchases: Joi.number().min(0).optional().messages({
    "number.min": "Total purchases cannot be negative",
  }),
});

const updateSupplierVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid supplier ID format",
    "string.length": "Invalid supplier ID format",
  }),
  name: Joi.string().min(2).max(50).trim().optional().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
  company: Joi.string().min(2).max(100).trim().optional().messages({
    "string.min": "Company name must be at least 2 characters",
    "string.max": "Company name cannot exceed 100 characters",
  }),
  contactNumber: Joi.string()
    .pattern(/^[0-9+\-\s()]{10,20}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Contact number must be between 10 to 20 characters and contain only numbers, +, -, spaces, and parentheses",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  address: Joi.string().max(200).optional(),
  totalPurchases: Joi.number().min(0).optional().messages({
    "number.min": "Total purchases cannot be negative",
  }),
});

// const updateSupplierPurchasesVal = Joi.object({
//   id: Joi.string().hex().length(24).required().messages({
//     "string.hex": "Invalid supplier ID format",
//     "string.length": "Invalid supplier ID format",
//   }),
//   amount: Joi.number().required().messages({
//     "number.base": "Amount must be a number",
//     "any.required": "Purchase amount is required",
//   }),
// });

const idParamVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid supplier ID format",
    "string.length": "Invalid supplier ID format",
  }),
});

export { addSupplierVal, updateSupplierVal, idParamVal };
