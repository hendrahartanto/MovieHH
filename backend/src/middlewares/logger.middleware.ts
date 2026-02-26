import pinoHttp from "pino-http";
import logger from "../lib/utils/logger";

const loggerMiddleware = pinoHttp({
  logger,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default loggerMiddleware;
