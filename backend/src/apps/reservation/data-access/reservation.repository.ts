import prisma from "../../../db";
import { CreateReservationDTO } from "../domain/dto/create-reservation.dto";

const reserve = (reserveData: CreateReservationDTO) => {
  return prisma.reservation.create({ data: reserveData });
};

export default {
  reserve,
};
