import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../../db";

const reserveMany = async (
  data: Prisma.ReservationCreateInput,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.reservation.create({
    data,
    include: { reservationDetails: true },
  });
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
    include: { showTime: true, reservationDetails: true },
  });
};

export default {
  reserveMany,
  updateStatus,
  getReservationById,
};
