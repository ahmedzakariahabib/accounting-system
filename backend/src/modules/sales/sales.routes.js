import { validation } from "../../middleware/validation.js";
import express from "express";
import {
  addSale,
  deleteSale,
  getAllSales,
  getSingleSale,
  updateSale,
} from "./sales.controller.js";
import {
  addSaleVal,
  getSalesQueryVal,
  idParamVal,
  updateSaleVal,
} from "./sales.validation.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const salesRouter = express.Router();

// salesRouter.get("/stats", protectedRoutes, getSalesStats);

salesRouter
  .route("/")
  .post(protectedRoutes, validation(addSaleVal), addSale)
  .get(protectedRoutes, validation(getSalesQueryVal), getAllSales);

salesRouter
  .route("/:id")
  .get(protectedRoutes, validation(idParamVal), getSingleSale)
  .patch(protectedRoutes, validation(updateSaleVal), updateSale)
  .delete(protectedRoutes, validation(idParamVal), deleteSale);

export { salesRouter };
