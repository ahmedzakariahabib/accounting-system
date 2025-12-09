import { validation } from "../../middleware/validation.js";
import express from "express";
import {
  addInventoryItem,
  deleteInventoryItem,
  getAllInventoryItems,
  getSingleInventoryItem,
  updateInventoryItem,
  updateInventoryQuantity,
  getInventoryStats,
} from "./inventory.controller.js";
import {
  addInventoryVal,
  updateInventoryVal,
  idParamVal,
  updateQuantityVal,
} from "./inventory.validation.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const inventoryRouter = express.Router();

// Stats route (before /:id to avoid conflict)
inventoryRouter.get("/stats", protectedRoutes, getInventoryStats);

// Main CRUD routes
inventoryRouter
  .route("/")
  .post(protectedRoutes, validation(addInventoryVal), addInventoryItem)
  .get(protectedRoutes, getAllInventoryItems);

inventoryRouter
  .route("/:id")
  .get(protectedRoutes, validation(idParamVal), getSingleInventoryItem)
  .patch(protectedRoutes, validation(updateInventoryVal), updateInventoryItem)
  .delete(protectedRoutes, validation(idParamVal), deleteInventoryItem);

// Quantity update route
inventoryRouter.patch(
  "/:id/quantity",
  protectedRoutes,
  validation(updateQuantityVal),
  updateInventoryQuantity
);

export { inventoryRouter };
