import prisma from "../../../db";
import { CreateSeatDTO } from "../dto/create-seat.dto";

const createSeats = async (newSeatData: CreateSeatDTO[], tx: any = prisma) => {
  return tx.seat.createMany({ data: newSeatData });
};

export default {
  createSeats,
};
