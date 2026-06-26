import express from "express";
import helmet from "helmet";
import loggerMiddleware from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { globalLimiter } from "./middlewares/rate-limiter.middleware";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { corsOrigin } from "./config";

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS
app.use(
  cors({
    origin: corsOrigin,
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

//global rate limiter
app.use(globalLimiter);

//expose folder uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//routes
app.use("/", routes);

//error middleware
app.use(errorMiddleware);

export default app;
