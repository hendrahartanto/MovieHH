import express from "express";
import asyncHandler from "../../../core/helpers/async-handler";
import { createUserSchema } from "../domain/dto/create-user.dto";
import authService from "../domain/auth.service";
import { SuccessResponse } from "../../../core/api-response";
import { loginUserSchema } from "../domain/dto/login-user.dto";
import { TokenExpireError } from "../../../core/api-error";

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

const refreshAccessToken = asyncHandler(async (req, res) => {
  console.log(req.cookies);
  const accessToken = await authService.refreshAccessToken(
    req.cookies.refreshToken
  );

  if (!accessToken) new TokenExpireError();

  new SuccessResponse("Refresh Access Token Successful", {
    token: accessToken,
  }).send(res);
});

export default {
  register,
  login,
  refreshAccessToken,
};
