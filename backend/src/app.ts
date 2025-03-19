import express, { NextFunction, Request, Response } from "express";
import { ApiError, ErrorType, InternalError } from "./core/api-error";
import loggerMiddleware from "./middlewares/logger-middleware";
import logger from "./core/utils/logger";
import routes from "./routes/index";

const app = express();

//to be able to accept form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logger middleware
app.use(loggerMiddleware);

//testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//routes
app.use("/", routes);

//error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    // handle error agar bisa kirim response balik ke frontend
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
  } else {
    logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    logger.error(err);
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
