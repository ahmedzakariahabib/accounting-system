import { validation } from "../../middleware/validation.js";
import express from "express";
import {
  addCustomer,
  deleteCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
} from "./customers.controller.js";
import {
  addCustomerVal,
  updateCustomerVal,
  idParamVal,
} from "./customers.validation.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const customersRouter = express.Router();

customersRouter
  .route("/")
  .post(protectedRoutes, validation(addCustomerVal), addCustomer)
  .get(protectedRoutes, getAllCustomers);

customersRouter
  .route("/:id")
  .get(protectedRoutes, validation(idParamVal), getSingleCustomer)
  .patch(protectedRoutes, validation(updateCustomerVal), updateCustomer)
  .delete(protectedRoutes, validation(idParamVal), deleteCustomer);

export { customersRouter };
