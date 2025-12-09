process.on("uncaughtException", (err) => {
  console.log("error", err);
});
import { globalError } from "./src/middleware/globalError.js";
import { bootstrap } from "./src/modules/index.routes.js";
import { AppError } from "./src/utils/AppError.js";
import rateLimit from "express-rate-limit";
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import hpp from "hpp";
import { dbConnection } from "./database/dbConnection.js";
dotenv.config({ quiet: true });
const app = express();
const port = 3000;
app.use(helmet());
app.use(hpp());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many requests from this IP, please try again later.",
        429
      )
    );
  },
});
app.use(limiter);
app.use("/uploads", express.static("uploads"));
bootstrap(app);
dbConnection();

app.use((req, res, next) => {
  next(new AppError(`not found endPoint: ${req.originalUrl}`, 404));
});
app.use(globalError);
process.on("unhandledRejection", (err) => {
  console.log("error", err);
});

app.listen(port, () =>
  console.log(`accounting system listening on port ${port} 🎉`)
);
