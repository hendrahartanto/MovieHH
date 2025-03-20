import { AuthFailureError, BadRequestError } from "../../../core/api-error";
import { SuccessResponse } from "../../../core/api-response";
import userRepository from "../../user/data-access/user.repository";
import { CreateUserDTO } from "./dto/create-user.dto";
import bcrypt from "bcrypt";
import { LoginUserDTO } from "./dto/login-user.dto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../core/utils/jwt";

const register = async (registerUserData: CreateUserDTO) => {
  const passwordHash = await bcrypt.hash(registerUserData.password, 10);

  const user = await userRepository.getUserByEmail(registerUserData.email);
  if (user) throw new BadRequestError("Email is already taken");

  return userRepository.createUser({
    ...registerUserData,
    password: passwordHash,
  });
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

export default {
  register,
  login,
};
