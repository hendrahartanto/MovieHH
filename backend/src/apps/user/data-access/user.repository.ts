import prisma from "../../../db";
import { CreateUserDTO } from "../../auth/domain/dto/create-user.dto";

const createUser = async (newUserData: CreateUserDTO) => {
  return prisma.user.create({ data: newUserData });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export default {
  createUser,
  getUserByEmail,
};
