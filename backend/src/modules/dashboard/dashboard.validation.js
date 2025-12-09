import Joi from "joi";

const getSummaryVal = Joi.object({
  period: Joi.string().valid("7days", "30days", "90days", "year").optional(),
});

const getRecentSalesVal = Joi.object({
  limit: Joi.number().min(1).max(50).optional().messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 50",
  }),
});

export { getSummaryVal, getRecentSalesVal };
