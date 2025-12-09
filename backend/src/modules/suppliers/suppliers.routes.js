import { validation } from "../../middleware/validation.js";
import express from "express";
import {
  addSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
} from "./suppliers.controller.js";
import {
  addSupplierVal,
  updateSupplierVal,
  idParamVal,
} from "./suppliers.validation.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const suppliersRouter = express.Router();

suppliersRouter
  .route("/")
  .post(protectedRoutes, validation(addSupplierVal), addSupplier)
  .get(protectedRoutes, getAllSuppliers);

suppliersRouter
  .route("/:id")
  .get(protectedRoutes, validation(idParamVal), getSingleSupplier)
  .patch(protectedRoutes, validation(updateSupplierVal), updateSupplier)
  .delete(protectedRoutes, validation(idParamVal), deleteSupplier);

// suppliersRouter
//   .route("/:id/purchases")
//   .patch(
//     protectedRoutes,
//     validation(updateSupplierPurchasesVal),
//     updateSupplierPurchases
//   );

export { suppliersRouter };
