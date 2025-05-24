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

const updateTheater = async (theaterId: string, data: { name: string }) => {
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
  updateTheater,
  deleteTheater,
};
