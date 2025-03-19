import express, { NextFunction, Request, Response } from "express";
import { ApiError, ErrorType } from "./core/api-error";
import loggerMiddleware from "./middlewares/logger-middleware";
import logger from "./core/utils/logger";
import routes from "./routes/index";
import bodyParser from "body-parser";

const app = express();

//to be able to accept form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//routes
app.use("/", routes);

//logger middleware
app.use(loggerMiddleware);

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
  }
});

export default app;
