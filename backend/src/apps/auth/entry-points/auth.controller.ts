import express from "express";
import asyncHandler from "../../../middlewares/async-handler";
import { createUserSchema } from "../domain/dto/create-user.dto";
import authService from "../domain/auth.service";
import { SuccessResponse } from "../../../core/api-response";
import { loginUserSchema } from "../domain/dto/login-user.dto";

const register = asyncHandler(async (req, res) => {
  const validatedData = createUserSchema.parse(req.body);
  const user = await authService.register(validatedData);

  new SuccessResponse("Register Successful", { user }).send(res);
});

const login = asyncHandler(async (req, res) => {
  const validatedData = loginUserSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await authService.login(
    validatedData
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/auth/refresh",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
  });

  new SuccessResponse("Login Success", { user, token: accessToken }).send(res);
});

export default {
  register,
  login,
};
