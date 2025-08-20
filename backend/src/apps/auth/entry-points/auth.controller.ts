import asyncHandler from "../../../core/helpers/async-handler";
import { createUserSchema } from "../domain/dto/create-user.dto";
import authService from "../domain/auth.service";
import {
  SuccessMsgResponse,
  SuccessResponse,
} from "../../../core/api-response";
import { loginUserSchema } from "../domain/dto/login-user.dto";
import { BadTokenError, TokenExpireError } from "../../../core/api-error";
import { ProtectedRequest } from "../../../types/app-requests";
import { verifyAccessToken } from "../../../core/utils/jwt";
import userRepository from "../../user/data-access/user.repository";

const register = asyncHandler(async (req, res) => {
  const validatedData = createUserSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await authService.register(
    validatedData
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/auth",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  new SuccessResponse("Register Successful", { user, token: accessToken }).send(
    res
  );
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
    path: "/auth",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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
    path: "/auth",
  });

  new SuccessMsgResponse("Logout successful").send(res);
});

const me = asyncHandler<ProtectedRequest>(async (req, res) => {
  const authHeader = req.headers.authorization;
  let token: string | null = null;
  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      const refreshToken = req.cookies.refreshToken;
      token = await authService.refreshAccessToken(refreshToken);
    }
    const decoded = verifyAccessToken(token) as { userId: string };
    const user = await userRepository.getUserById(decoded.userId);

    return new SuccessResponse("Get current user successful", user).send(res);
  } catch (error: any) {
    return new SuccessResponse("Get curretn user successful", null).send(res);
  }
});

export default {
  register,
  login,
  refreshAccessToken,
  logout,
  me,
};
