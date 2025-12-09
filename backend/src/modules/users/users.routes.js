import { validation } from "../../middleware/validation.js";
import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "./users.controller.js";
import { updateUserVal, idParamVal } from "./users.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const usersRouter = express.Router();

usersRouter.route("/").get(protectedRoutes, allowedTo("admin"), getAllUsers);

usersRouter
  .route("/:id")
  .get(
    protectedRoutes,
    // allowedTo("admin"),
    validation(idParamVal),
    getSingleUser
  )
  .patch(
    protectedRoutes,
    allowedTo("admin"),
    validation(updateUserVal),
    updateUser
  )
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validation(idParamVal),
    deleteUser
  );

export { usersRouter };
