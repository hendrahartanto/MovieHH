import { NextFunction, Request, Response } from "express";
import asyncHandler from "../core/helpers/async-handler";
import { AccessTokenError, AuthFailureError } from "../core/api-error";
import { verifyAccessToken } from "../core/utils/jwt";
import { ProtectedRequest } from "../types/app-requests";
import { JwtPayload } from "../types/jwt-payload";
import { TokenExpiredError } from "jsonwebtoken";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AuthFailureError("Unauthorized");
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token) as JwtPayload;
      (req as ProtectedRequest).user = decoded;
      next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }
);
