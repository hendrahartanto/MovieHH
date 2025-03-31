import prisma from "../../../db";
import { CreateTheaterDTO } from "../domain/dto/create-theater.dto";

const createTheater = async (newTheaterData: CreateTheaterDTO) => {
  return prisma.theater.create({ data: newTheaterData });
};

export default {
  createTheater,
};
