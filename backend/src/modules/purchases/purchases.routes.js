import { validation } from "../../middleware/validation.js";
import express from "express";
import {
  addPurchase,
  deletePurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
} from "./purchases.controller.js";
import {
  addPurchaseVal,
  updatePurchaseVal,
  idParamVal,
} from "./purchases.validation.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const purchasesRouter = express.Router();

purchasesRouter
  .route("/")
  .post(protectedRoutes, validation(addPurchaseVal), addPurchase)
  .get(protectedRoutes, getAllPurchases);

purchasesRouter
  .route("/:id")
  .get(protectedRoutes, validation(idParamVal), getSinglePurchase)
  .patch(protectedRoutes, validation(updatePurchaseVal), updatePurchase)
  .delete(protectedRoutes, validation(idParamVal), deletePurchase);

export { purchasesRouter };
