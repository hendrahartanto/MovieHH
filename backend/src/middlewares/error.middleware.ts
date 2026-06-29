import { NextFunction, Request, Response } from "express";
import {
  ApiError,
  BadRequestError,
  InternalError,
} from "../lib/exceptions/api-error";
import logger from "../lib/utils/logger";
import { ZodError } from "zod";
import multer from "multer";

const environment = process.env.NODE_ENV || "development";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // handle Multer specific errors
  if (err instanceof multer.MulterError) {
    let message = err.message;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size limit exceeded. Maximum limit is 10MB.";
    }
    ApiError.handle(new BadRequestError(message), res);
    logger.error(
      `400 - MulterError: ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    return;
  }

  // handle zod error (bad request error)
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
      `400 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    return;
  }

  if (err instanceof ApiError) {
    // handle error agar bisa kirim response balik ke frontend
    ApiError.handle(err, res);
    logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
  } else {
    logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    if (environment === "development") {
      res.status(500).send(err);
      return;
    }
    ApiError.handle(new InternalError(), res);
  }
};
