import Joi from "joi";

const dateRangeVal = Joi.object({
  startDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid start date",
  }),
  endDate: Joi.date().min(Joi.ref("startDate")).optional().messages({
    "date.base": "Please provide a valid end date",
    "date.min": "End date must be after start date",
  }),
  period: Joi.string()
    .valid("today", "week", "month", "quarter", "year", "custom")
    .optional()
    .messages({
      "any.only":
        "Period must be one of: today, week, month, quarter, year, custom",
    }),
});

const salesReportVal = Joi.object({
  startDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid start date",
  }),
  endDate: Joi.date().min(Joi.ref("startDate")).optional().messages({
    "date.base": "Please provide a valid end date",
    "date.min": "End date must be after start date",
  }),
  period: Joi.string()
    .valid("today", "week", "month", "quarter", "year", "custom")
    .optional()
    .messages({
      "any.only":
        "Period must be one of: today, week, month, quarter, year, custom",
    }),
  groupBy: Joi.string()
    .valid("day", "week", "month", "product", "category")
    .optional()
    .messages({
      "any.only": "GroupBy must be one of: day, week, month, product, category",
    }),
});

const profitReportVal = Joi.object({
  startDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid start date",
  }),
  endDate: Joi.date().min(Joi.ref("startDate")).optional().messages({
    "date.base": "Please provide a valid end date",
    "date.min": "End date must be after start date",
  }),
  period: Joi.string()
    .valid("today", "week", "month", "quarter", "year", "custom")
    .optional()
    .messages({
      "any.only":
        "Period must be one of: today, week, month, quarter, year, custom",
    }),
  includeExpenses: Joi.boolean().optional(),
});

const inventoryReportVal = Joi.object({
  lowStock: Joi.boolean().optional(),
  category: Joi.string().optional(),
  sortBy: Joi.string()
    .valid("name", "quantity", "value", "lastUpdated")
    .optional()
    .messages({
      "any.only": "SortBy must be one of: name, quantity, value, lastUpdated",
    }),
  order: Joi.string().valid("asc", "desc").optional().messages({
    "any.only": "Order must be either 'asc' or 'desc'",
  }),
});

const summaryReportVal = Joi.object({
  period: Joi.string()
    .valid("today", "week", "month", "quarter", "year")
    .optional()
    .messages({
      "any.only": "Period must be one of: today, week, month, quarter, year",
    }),
});

export {
  dateRangeVal,
  salesReportVal,
  profitReportVal,
  inventoryReportVal,
  summaryReportVal,
};
