import { validation } from "../../middleware/validation.js";
import express from "express";

import { getSettings, updateSettings } from "./settings.controller.js";
import { updateSettingsVal } from "./settings.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../services/fileUploads.js";

const settingsRouter = express.Router();

settingsRouter.get("/", protectedRoutes, getSettings);

settingsRouter.patch(
  "/",
  protectedRoutes,
  // allowedTo("admin"),
  uploadSingleFile("image"),
  validation(updateSettingsVal),
  updateSettings
);

export { settingsRouter };
