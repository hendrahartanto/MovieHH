import pinoHttp from "pino-http";
import logger from "../lib/utils/logger";

const DEBUG_HEADER_NAMES = [
  "content-length",
  "content-type",
  "origin",
  "referer",
  "user-agent",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-request-id",
];

const loggerMiddleware = pinoHttp({
  logger,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: DEBUG_HEADER_NAMES.reduce<Record<string, string | string[]>>(
        (headers, headerName) => {
          const headerValue = req.headers[headerName];

          if (headerValue !== undefined) {
            headers[headerName] = headerValue;
          }

          return headers;
        },
        {},
      ),
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default loggerMiddleware;
