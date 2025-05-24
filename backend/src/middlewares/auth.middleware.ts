import { NextFunction, Request, Response } from "express";
import asyncHandler from "../core/helpers/async-handler";
import { AccessTokenError, AuthFailureError } from "../core/api-error";
import { verifyAccessToken } from "../core/utils/jwt";
import { ProtectedRequest } from "../types/app-requests";
import { TokenExpiredError } from "jsonwebtoken";
import userRepository from "../apps/user/data-access/user.repository";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AuthFailureError("Invalid authorization");
      }

      const token = authHeader.split(" ")[1];

      const decoded = verifyAccessToken(token) as { userId: string };
      //isi dari decoded ini adalah {userId, iat, exp}

      const user = await userRepository.getUserById(decoded.userId);

      // (req as ProtectedRequest).user = decoded;
      next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }
);
