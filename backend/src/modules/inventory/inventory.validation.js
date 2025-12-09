import Joi from "joi";

const addInventoryVal = Joi.object({
  itemName: Joi.string().min(2).max(100).trim().required().messages({
    "string.empty": "Item name is required",
    "string.min": "Item name must be at least 2 characters",
    "string.max": "Item name cannot exceed 100 characters",
  }),
  category: Joi.string().min(2).max(50).trim().required().messages({
    "string.empty": "Category is required",
    "string.min": "Category must be at least 2 characters",
    "string.max": "Category cannot exceed 50 characters",
  }),
  supplier: Joi.string().hex().length(24).optional().messages({
    "string.hex": "Invalid supplier ID format",
    "string.length": "Invalid supplier ID format",
  }),
  size: Joi.string().trim().optional().messages({
    "string.base": "Size must be a string",
  }),
  color: Joi.string().trim().optional().messages({
    "string.base": "Color must be a string",
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity cannot be negative",
    "any.required": "Quantity is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  lowStockThreshold: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(10)
    .messages({
      "number.min": "Low stock threshold cannot be negative",
    }),
  sku: Joi.string().trim().optional().messages({
    "string.base": "SKU must be a string",
  }),
});

const updateInventoryVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid inventory item ID format",
    "string.length": "Invalid inventory item ID format",
  }),
  itemName: Joi.string().min(2).max(100).trim().optional().messages({
    "string.min": "Item name must be at least 2 characters",
    "string.max": "Item name cannot exceed 100 characters",
  }),
  category: Joi.string().min(2).max(50).trim().optional().messages({
    "string.min": "Category must be at least 2 characters",
    "string.max": "Category cannot exceed 50 characters",
  }),
  supplier: Joi.string().hex().length(24).optional().allow(null).messages({
    "string.hex": "Invalid supplier ID format",
    "string.length": "Invalid supplier ID format",
  }),
  size: Joi.string().trim().optional().allow(null),
  color: Joi.string().trim().optional().allow(null),
  quantity: Joi.number().integer().min(0).optional().messages({
    "number.min": "Quantity cannot be negative",
  }),
  price: Joi.number().min(0).optional().messages({
    "number.min": "Price cannot be negative",
  }),
  lowStockThreshold: Joi.number().integer().min(0).optional().messages({
    "number.min": "Low stock threshold cannot be negative",
  }),
  sku: Joi.string().trim().optional().allow(null),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const idParamVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid inventory item ID format",
    "string.length": "Invalid inventory item ID format",
  }),
});

const updateQuantityVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid inventory item ID format",
    "string.length": "Invalid inventory item ID format",
  }),
  quantity: Joi.number().integer().required().messages({
    "number.base": "Quantity must be a number",
    "any.required": "Quantity is required",
  }),
  operation: Joi.string().valid("add", "subtract", "set").required().messages({
    "any.only": "Operation must be either 'add', 'subtract', or 'set'",
    "any.required": "Operation is required",
  }),
});

export { addInventoryVal, updateInventoryVal, idParamVal, updateQuantityVal };
