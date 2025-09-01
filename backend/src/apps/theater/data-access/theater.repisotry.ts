import prisma from "../../../db";
import { CreateTheaterDTO } from "../domain/dto/create-theater.dto";

const createTheater = async (newTheaterData: CreateTheaterDTO) => {
  return prisma.theater.create({ data: newTheaterData });
};

const getTheaterById = async (theaterId: string) => {
  return prisma.theater.findUnique({
    where: { id: theaterId },
    include: { seats: true },
  });
};

const getTheatersPaginated = async (page: number, limit: number) => {
  const [theaters, total] = await Promise.all([
    prisma.theater.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        seats: true,
        showTimes: true,
      },
    }),
    prisma.genre.count(),
  ]);

  return { theaters, total };
};

const getTheaters = async () => {
  return prisma.theater.findMany();
};

const updateTheater = async (theaterId: string, data: { name: string }) => {
  return prisma.theater.update({
    where: { id: theaterId },
    data,
  });
};

const deleteTheater = async (theaterId: string) => {
  return prisma.theater.delete({ where: { id: theaterId } });
};

const searchTheaters = async (query: string, page: number, limit: number) => {
  const [theaters, total] = await Promise.all([
    prisma.theater.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        seats: true,
        showTimes: true,
      },
    }),
    prisma.genre.count(),
  ]);

  return { theaters, total };
};

export default {
  createTheater,
  getTheaterById,
  getTheatersPaginated,
  getTheaters,
  updateTheater,
  deleteTheater,
  searchTheaters,
};
