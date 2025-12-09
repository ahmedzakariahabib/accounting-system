import { validation } from "../../middleware/validation.js";
import express from "express";
import {
  getSalesReport,
  getProfitReport,
  getInventoryReport,
  getSummaryReport,
} from "./reports.controller.js";
import {
  salesReportVal,
  profitReportVal,
  inventoryReportVal,
  summaryReportVal,
} from "./reports.validation.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const reportsRouter = express.Router();

// Sales report endpoint
reportsRouter.get(
  "/sales",
  protectedRoutes,
  validation(salesReportVal),
  getSalesReport
);

// Profit report endpoint
reportsRouter.get(
  "/profit",
  protectedRoutes,
  validation(profitReportVal),
  getProfitReport
);

// Inventory report endpoint
reportsRouter.get(
  "/inventory",
  protectedRoutes,
  validation(inventoryReportVal),
  getInventoryReport
);

// Summary report endpoint (Dashboard Charts)
reportsRouter.get(
  "/summary",
  protectedRoutes,
  validation(summaryReportVal),
  getSummaryReport
);

export { reportsRouter };
