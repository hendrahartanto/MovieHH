import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisConnection } from "../infrastructure/redis";

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) =>
      redisConnection.call(args[0], ...args.slice(1)) as any,
  }),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: options.message,
    });
  },
  message: "Too many requests, please try again later.",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) =>
      redisConnection.call(args[0], ...args.slice(1)) as any,
  }),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: options.message,
    });
  },
  message:
    "Too many login/register attempts, please try again after 15 minutes.",
});
