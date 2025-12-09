import { validation } from "../../middleware/validation.js";
import express from "express";

import { protectedRoutes } from "../auth/auth.controller.js";
import { changePassword, updateProfile } from "./profile.controller.js";
import { changePasswordVal, updateValProfile } from "./profile.validation.js";

const profileRouter = express.Router();

profileRouter.patch(
  "/:id",
  protectedRoutes,
  validation(updateValProfile),
  updateProfile
);

profileRouter.post(
  "/change-password",
  protectedRoutes,
  validation(changePasswordVal),
  changePassword
);

export { profileRouter };
