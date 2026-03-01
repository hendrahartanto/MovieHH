import prisma from "../../../db";
import { CreateSeatDTO } from "../dto/create-seat.dto";

const createSeats = async (newSeatData: CreateSeatDTO[]) => {
  return prisma.seat.createMany({ data: newSeatData });
};

export default {
  createSeats,
};
