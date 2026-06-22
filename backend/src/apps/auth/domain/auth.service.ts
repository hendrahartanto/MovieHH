import {
  AuthFailureError,
  BadRequestError,
  BadTokenError,
  TokenExpireError,
} from "../../../lib/exceptions/api-error";
import userRepository from "../../user/data-access/user.repository";
import { CreateUserDTO } from "../dto/create-user.dto";
import bcrypt from "bcrypt";
import { LoginUserDTO } from "../dto/login-user.dto";
import { ChangePasswordDTO } from "../dto/change-password.dto";
import { UpdateProfileDTO } from "../dto/update-profile.dto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../lib/utils/jwt.util";

const register = async (registerUserData: CreateUserDTO) => {
  const passwordHash = await bcrypt.hash(registerUserData.password, 10);

  const existingUser = await userRepository.getUserByEmail(
    registerUserData.email
  );
  if (existingUser) throw new BadRequestError("Email is already taken");

  const user = await userRepository.createUser({
    ...registerUserData,
    password: passwordHash,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

const login = async (loginUserData: LoginUserDTO) => {
  const user = await userRepository.getUserByEmail(loginUserData.email);
  if (!user) throw new BadRequestError("User with given email not found");
  if (!(await bcrypt.compare(loginUserData.password, user.password))) {
    throw new AuthFailureError("Invalid Credential");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded: any = verifyRefreshToken(refreshToken);
    const user = await userRepository.getUserById(decoded.userId);
    if (!user) throw new BadTokenError();

    const newAccessToken = generateAccessToken(user.id);
    return newAccessToken;
  } catch (error) {
    throw new TokenExpireError("Session expired");
  }
};

const changePassword = async (userId: string, data: ChangePasswordDTO) => {
  const user = await userRepository.getUserById(userId);
  if (!user) throw new BadRequestError("User not found");

  const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AuthFailureError("Incorrect current password");
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 10);
  await userRepository.updateUserPassword(userId, passwordHash);
};

const updateProfile = async (userId: string, data: UpdateProfileDTO) => {
  const user = await userRepository.getUserById(userId);
  if (!user) throw new BadRequestError("User not found");

  if (data.email !== user.email) {
    const existingUser = await userRepository.getUserByEmail(data.email);
    if (existingUser) throw new BadRequestError("Email is already taken");
  }

  return userRepository.updateUserProfile(userId, data);
};

export default {
  register,
  login,
  refreshAccessToken,
  changePassword,
  updateProfile,
};
