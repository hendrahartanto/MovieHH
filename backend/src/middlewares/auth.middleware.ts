import { NextFunction, Request, Response } from "express";
import asyncHandler from "../core/helpers/async-handler";
import { AccessTokenError, AuthFailureError } from "../core/api-error";
import { verifyAccessToken } from "../core/utils/jwt";
import { ProtectedRequest } from "../types/app-requests";
import { TokenExpiredError } from "jsonwebtoken";
import userRepository from "../apps/user/data-access/user.repository";
import { Role } from "@prisma/client";

export const authenticate = asyncHandler(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AuthFailureError("Invalid authorization");
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token) as { userId: string };
      //isi dari decoded ini adalah {userId, iat, exp}

      const user = await userRepository.getUserById(decoded.userId);
      if (!user) throw new AuthFailureError("User not registered!");
      req.user = user;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }
);

export const authorize = (role: Role) =>
  asyncHandler(
    async (req: ProtectedRequest, res: Response, next: NextFunction) => {
      if (!req.user || !req.user.role)
        throw new AuthFailureError("Permission denied");

      const userRole = req.user.role;
      if (userRole !== role) throw new AuthFailureError("Permission denied");

      return next();
    }
  );
