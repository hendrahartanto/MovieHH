import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { CreateTheaterDTO } from "../dto/create-theater.dto";

const createTheater = async (newTheaterData: CreateTheaterDTO) => {
  return prisma.theater.create({ data: newTheaterData });
};

const getTheaterById = async (theaterId: string) => {
  return prisma.theater.findFirst({
    where: { id: theaterId, deletedAt: null },
    include: {
      seats: { where: { deletedAt: null } },
      location: true,
    },
  });
};

const getTheatersPaginated = async (
  page: number,
  limit: number,
  search: string,
) => {
  const whereClause: Prisma.TheaterWhereInput = {
    name: {
      contains: search,
      mode: "insensitive",
    },
    deletedAt: null,
  };

  const [theaters, total] = await Promise.all([
    prisma.theater.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        seats: { where: { deletedAt: null } },
        movieSchedules: {
          where: { deletedAt: null },
          include: { showTimes: { where: { deletedAt: null } } },
        },
        location: true,
      },
    }),
    prisma.theater.count({ where: whereClause }),
  ]);

  return { theaters, total };
};

const getTheaters = async () => {
  return prisma.theater.findMany({
    where: { deletedAt: null },
    include: {
      seats: { where: { deletedAt: null } },
      movieSchedules: { where: { deletedAt: null } },
      location: true,
    },
  });
};

const updateTheater = async (
  theaterId: string,
  data: { name?: string; layout?: any },
  tx: any = prisma,
) => {
  return tx.theater.update({
    where: { id: theaterId },
    data,
  });
};

const deleteTheater = async (theaterId: string, tx: any = prisma) => {
  return tx.theater.update({
    where: { id: theaterId },
    data: { deletedAt: new Date() },
  });
};

export default {
  createTheater,
  getTheaterById,
  getTheatersPaginated,
  getTheaters,
  updateTheater,
  deleteTheater,
};
