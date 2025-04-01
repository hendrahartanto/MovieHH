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

export default {
  createTheater,
  getTheaterById,
};
