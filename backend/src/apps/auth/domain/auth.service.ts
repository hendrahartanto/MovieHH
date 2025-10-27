import {
  AuthFailureError,
  BadRequestError,
  BadTokenError,
  TokenExpireError,
} from "../../../core/api-error";
import userRepository from "../../user/data-access/user.repository";
import { CreateUserDTO } from "./dto/create-user.dto";
import bcrypt from "bcrypt";
import { LoginUserDTO } from "./dto/login-user.dto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../core/utils/jwt";

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

    const newAccessTooken = generateAccessToken(user.id);
    return newAccessTooken;
  } catch (error) {
    throw new TokenExpireError("Session expired");
  }
};

export default {
  register,
  login,
  refreshAccessToken,
};
