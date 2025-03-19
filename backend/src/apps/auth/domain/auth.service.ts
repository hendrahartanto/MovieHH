import { BadRequestError } from "../../../core/api-error";
import { SuccessResponse } from "../../../core/api-response";
import userRepository from "../../user/data-access/user.repository";
import { CreateUserDTO } from "./dto/create-user.dto";
import bcrypt from "bcrypt";

export const registerUser = async (registerUserData: CreateUserDTO) => {
  const passwordHash = await bcrypt.hash(registerUserData.password, 10);

  const user = await userRepository.getUserByEmail(registerUserData.email);
  if (user) throw new BadRequestError();

  return userRepository.createUser(registerUserData);
};

export default {
  registerUser,
};
