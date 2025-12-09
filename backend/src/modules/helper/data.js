import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const helperRouter = express.Router();

helperRouter
  .route("/health")
  .get(protectedRoutes, allowedTo("admin"), (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Server is running",
    });
  });

helperRouter
  .route("/version")
  .get(protectedRoutes, allowedTo("admin"), (req, res) => {
    res.status(200).json({
      version: "1.0.0",
    });
  });

export { helperRouter };
