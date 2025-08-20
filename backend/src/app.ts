import express, { NextFunction, Request, Response } from "express";
import {
  ApiError,
  BadRequestError,
  ErrorType,
  InternalError,
} from "./core/api-error";
import loggerMiddleware from "./middlewares/logger.middleware";
import logger from "./core/utils/logger";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import cors from "cors";
import path from "path";

const environment = process.env.NODE_ENV || "development";

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//to be able to receive cookies from request
app.use(cookieParser());

//to be able to accept form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logger middleware
app.use(loggerMiddleware);

//expose folder uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//routes
app.use("/", routes);

//error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // hanlde zod error (bad request error)
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    const errorMessage = formatted
      .map((e) => `${e.path}: ${e.message}`)
      .join(", ");

    ApiError.handle(new BadRequestError(errorMessage), res);
    logger.error(
      `400 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return;
  }

  if (err instanceof ApiError) {
    // handle error agar bisa kirim response balik ke frontend
    ApiError.handle(err, res);
    logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } else {
    logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    if (environment === "development") {
      res.status(500).send(err);
      return;
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
