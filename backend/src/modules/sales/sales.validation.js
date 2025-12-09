import Joi from "joi";

const saleItemSchema = Joi.object({
  itemName: Joi.string().trim().required().messages({
    "string.empty": "Item name is required",
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  unitPrice: Joi.number().min(0).required().messages({
    "number.base": "Unit price must be a number",
    "number.min": "Unit price cannot be negative",
    "any.required": "Unit price is required",
  }),
  total: Joi.number().optional(),
});

const addSaleVal = Joi.object({
  invoiceNumber: Joi.string().trim().optional(),
  customer: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid customer ID format",
    "string.length": "Invalid customer ID format",
    "any.required": "Customer is required",
  }),
  items: Joi.array().items(saleItemSchema).min(1).required().messages({
    "array.min": "At least one item is required",
    "any.required": "Items are required",
  }),
  subtotal: Joi.number().min(0).optional(),
  taxRate: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Tax rate cannot be negative",
    "number.max": "Tax rate cannot exceed 100%",
  }),
  taxAmount: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).default(0).messages({
    "number.min": "Discount cannot be negative",
  }),
  grandTotal: Joi.number().min(0).optional(),
  paymentStatus: Joi.string()
    .valid("Paid", "Pending", "Overdue")
    .default("Pending")
    .messages({
      "any.only": "Payment status must be Paid, Pending, or Overdue",
    }),
  notes: Joi.string().max(500).trim().optional().allow("").messages({
    "string.max": "Notes cannot exceed 500 characters",
  }),
  saleDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid sale date",
  }),
});

const updateSaleVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid sale ID format",
    "string.length": "Invalid sale ID format",
  }),
  invoiceNumber: Joi.string().trim().optional(),
  customer: Joi.string().hex().length(24).optional().messages({
    "string.hex": "Invalid customer ID format",
    "string.length": "Invalid customer ID format",
  }),
  items: Joi.array().items(saleItemSchema).min(1).optional().messages({
    "array.min": "At least one item is required",
  }),
  subtotal: Joi.number().min(0).optional(),
  taxRate: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Tax rate cannot be negative",
    "number.max": "Tax rate cannot exceed 100%",
  }),
  taxAmount: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).optional().messages({
    "number.min": "Discount cannot be negative",
  }),
  grandTotal: Joi.number().min(0).optional(),
  paymentStatus: Joi.string()
    .valid("Paid", "Pending", "Overdue")
    .optional()
    .messages({
      "any.only": "Payment status must be Paid, Pending, or Overdue",
    }),
  notes: Joi.string().max(500).trim().optional().allow("").messages({
    "string.max": "Notes cannot exceed 500 characters",
  }),
  saleDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid sale date",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const idParamVal = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid sale ID format",
    "string.length": "Invalid sale ID format",
  }),
});

const getSalesQueryVal = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
  search: Joi.string().trim().optional(),
  paymentStatus: Joi.string()
    .valid("Paid", "Pending", "Overdue")
    .optional()
    .messages({
      "any.only": "Payment status must be Paid, Pending, or Overdue",
    }),
  sortBy: Joi.string()
    .valid("createdAt", "saleDate", "grandTotal", "invoiceNumber")
    .optional(),
  order: Joi.string().valid("asc", "desc").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

export { addSaleVal, updateSaleVal, idParamVal, getSalesQueryVal };
