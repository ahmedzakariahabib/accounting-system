import Joi from "joi";

const updateSettingsVal = Joi.object({
  companyName: Joi.string().min(2).max(100).trim().optional().messages({
    "string.min": "Company name must be at least 2 characters",
    "string.max": "Company name cannot exceed 100 characters",
  }),
  address: Joi.string().max(200).trim().optional().messages({
    "string.max": "Address cannot exceed 200 characters",
  }),
  phoneNumber: Joi.string()
    .pattern(/^[+]?[\d\s\-()]+$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid phone number format",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  taxId: Joi.string().min(5).max(20).trim().optional().messages({
    "string.min": "Tax ID must be at least 5 characters",
    "string.max": "Tax ID cannot exceed 20 characters",
  }),
  image: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/jpg")
          .required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
      })
    )
    .optional(),
  paperSize: Joi.string().valid("A4", "Letter").optional().messages({
    "any.only": "Paper size must be either A4 or Letter",
  }),
  defaultInvoiceTemplate: Joi.string().trim().optional(),
  showCompanyDetails: Joi.boolean().optional().messages({
    "boolean.base": "Show company details must be a boolean value",
  }),
  darkMode: Joi.boolean().optional().messages({
    "boolean.base": "Dark mode must be a boolean value",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export { updateSettingsVal };
