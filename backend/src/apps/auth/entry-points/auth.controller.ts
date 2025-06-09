import asyncHandler from "../../../core/helpers/async-handler";
import { createUserSchema } from "../domain/dto/create-user.dto";
import authService from "../domain/auth.service";
import {
  SuccessMsgResponse,
  SuccessResponse,
} from "../../../core/api-response";
import { loginUserSchema } from "../domain/dto/login-user.dto";
import {
  AuthFailureError,
  BadTokenError,
  TokenExpireError,
} from "../../../core/api-error";

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
  if (req.cookies.refreshToken == undefined)
    throw new BadTokenError("User is not authenticated"); //TODO: masih ragu ini benar atau ngga

  const accessToken = await authService.refreshAccessToken(
    req.cookies.refreshToken
  );

  if (!accessToken) throw new TokenExpireError();

  new SuccessResponse("Refresh Access Token Successful", {
    token: accessToken,
  }).send(res);
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new BadTokenError("Refresh token not found");

  res.clearCookie("refreshToken", {
    sameSite: "strict",
    path: "/auth/refresh",
  });

  new SuccessMsgResponse("Logout successful").send(res);
});

export default {
  register,
  login,
  refreshAccessToken,
  logout,
};
