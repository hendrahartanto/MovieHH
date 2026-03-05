import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { CreateTheaterDTO } from "../dto/create-theater.dto";

const createTheater = async (newTheaterData: CreateTheaterDTO) => {
  return prisma.theater.create({ data: newTheaterData });
};

const getTheaterById = async (theaterId: string) => {
  return prisma.theater.findUnique({
    where: { id: theaterId },
    include: { seats: true, location: true },
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
  };

  const [theaters, total] = await Promise.all([
    prisma.theater.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        seats: true,
        movieSchedules: { include: { showTimes: true } },
        location: true,
      },
    }),
    prisma.theater.count({ where: whereClause }),
  ]);

  return { theaters, total };
};

const getTheaters = async () => {
  return prisma.theater.findMany({
    include: {
      seats: true,
      movieSchedules: true,
      location: true,
    },
  });
};

const updateTheater = async (theaterId: string, data: { name?: string, layout?: any }) => {
  return prisma.theater.update({
    where: { id: theaterId },
    data,
  });
};

const deleteTheater = async (theaterId: string) => {
  return prisma.theater.delete({ where: { id: theaterId } });
};

export default {
  createTheater,
  getTheaterById,
  getTheatersPaginated,
  getTheaters,
  updateTheater,
  deleteTheater,
};
