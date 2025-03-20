import { NextFunction, Request, Response } from "express";
import asyncHandler from "../core/helpers/async-handler";
import { AuthFailureError } from "../core/api-error";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthFailureError("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    // const decoded =
  }
);
