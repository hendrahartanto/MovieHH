import { Prisma } from "@prisma/client";
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

const updateUserProfile = async (
  userId: string,
  data: { name: string; email: string; avatarUrl?: string }
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

const getUsersPaginatedAdmin = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  const whereClause: Prisma.UserWhereInput = {};

  if (search.trim()) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { reservations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return { users, total };
};

const updateUserRole = async (userId: string, role: "USER" | "ADMIN") => {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

const toggleUserSuspension = async (userId: string, isSuspended: boolean) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isSuspended },
  });
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  updateUserProfile,
  getUsersPaginatedAdmin,
  updateUserRole,
  toggleUserSuspension,
};
