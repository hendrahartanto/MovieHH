import IORedis from "ioredis";

const redisOptions = {
  maxRetriesPerRequest: null,
};

export const redisConnection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, redisOptions)
  : new IORedis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      ...redisOptions,
    });
