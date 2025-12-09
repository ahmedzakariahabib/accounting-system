import { validation } from "../../middleware/validation.js";
import express from "express";
import { getSummary, getRecentSales } from "./dashboard.controller.js";
import { getSummaryVal, getRecentSalesVal } from "./dashboard.validation.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const dashboardRouter = express.Router();

dashboardRouter
  .route("/summary")
  .get(protectedRoutes, validation(getSummaryVal), getSummary);

dashboardRouter
  .route("/recent-sales")
  .get(protectedRoutes, validation(getRecentSalesVal), getRecentSales);

export { dashboardRouter };
