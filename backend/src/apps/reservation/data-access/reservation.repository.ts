import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../../db";
import { ReservationCreateInput } from "../domain/dto/create-reservation.dto";

const reserveMany = async (
  data: ReservationCreateInput[],
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  const reservations = await Promise.all(
    data.map((reservation) =>
      tx.reservation.create({
        data: reservation,
      })
    )
  );
  return reservations;
};

const updateStatus = async (
  reservationIds: string[],
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED",
  tx = prisma
) => {
  return tx.reservation.updateMany({
    where: { id: { in: reservationIds } },
    data: { status },
  });
};

const getReservationById = async (reservationId: string) => {
  return prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { seat: true, showTime: true },
  });
};

export default {
  reserveMany,
  updateStatus,
  getReservationById,
};
