import prisma from "../../../db";
import { CreateUserDTO } from "../../auth/dto/create-user.dto";

const createUser = async (newUserData: CreateUserDTO) => {
  return prisma.user.create({ data: newUserData });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const getUserById = async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
};

const updateUserPassword = async (userId: string, passwordHash: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: passwordHash },
  });
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
};
