import prisma from "../../../db";
import {
  CreateReservationDTO,
  ReservationCreateInput,
} from "../domain/dto/create-reservation.dto";

const reserveMany = (data: ReservationCreateInput[]) => {
  return prisma.reservation.createMany({
    data,
    skipDuplicates: true,
  });
};

export default {
  reserveMany,
};
