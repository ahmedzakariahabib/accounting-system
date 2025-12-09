import Joi from "joi";

const purchaseItemSchema = Joi.object({
  itemName: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Item name is required",
    "any.required": "Item name is required",
    "string.max": "Item name cannot exceed 100 characters",
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  unitPrice: Joi.number().min(0).required().messages({
    "number.min": "Unit price cannot be negative",
    "any.required": "Unit price is required",
  }),
});

const addPurchaseVal = Joi.object({
  supplierName: Joi.string().min(1).max(200).required().messages({
    "string.empty": "Supplier name is required",
    "any.required": "Supplier name is required",
    "string.max": "Supplier name cannot exceed 200 characters",
  }),
  purchaseDate: Joi.date().required().messages({
    "date.base": "Please provide a valid purchase date",
    "any.required": "Purchase date is required",
  }),
  items: Joi.array().items(purchaseItemSchema).min(1).required().messages({
    "array.min": "At least one item is required",
    "any.required": "Purchase items are required",
  }),
  discount: Joi.number().min(0).optional().default(0).messages({
    "number.min": "Discount cannot be negative",
  }),
  taxRate: Joi.number().min(0).max(100).optional().default(0).messages({
    "number.min": "Tax rate cannot be negative",
    "number.max": "Tax rate cannot exceed 100%",
  }),
  status: Joi.string()
    .valid("Draft", "Ordered", "Received", "Cancelled")
    .optional()
    .default("Draft")
    .messages({
      "any.only": "Status must be Draft, Ordered, Received, or Cancelled",
    }),
  notes: Joi.string().max(1000).optional().allow("").messages({
    "string.max": "Notes cannot exceed 1000 characters",
  }),
});

const updatePurchaseVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid purchase ID format",
    "string.length": "Invalid purchase ID format",
  }),
  supplierName: Joi.string().min(1).max(200).optional().messages({
    "string.empty": "Supplier name cannot be empty",
    "string.max": "Supplier name cannot exceed 200 characters",
  }),
  purchaseDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid purchase date",
  }),
  items: Joi.array().items(purchaseItemSchema).min(1).optional().messages({
    "array.min": "At least one item is required",
  }),
  discount: Joi.number().min(0).optional().messages({
    "number.min": "Discount cannot be negative",
  }),
  taxRate: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Tax rate cannot be negative",
    "number.max": "Tax rate cannot exceed 100%",
  }),
  status: Joi.string()
    .valid("Draft", "Ordered", "Received", "Cancelled")
    .optional()
    .messages({
      "any.only": "Status must be Draft, Ordered, Received, or Cancelled",
    }),
  notes: Joi.string().max(1000).optional().allow("").messages({
    "string.max": "Notes cannot exceed 1000 characters",
  }),
})
  .min(2)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const idParamVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid purchase ID format",
    "string.length": "Invalid purchase ID format",
  }),
});

export { addPurchaseVal, updatePurchaseVal, idParamVal };
