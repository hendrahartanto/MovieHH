import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../../db";

const createReservation = async (
  data: Prisma.ReservationCreateInput,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.reservation.create({
    data,
    include: { reservationDetails: true },
  });
};

const updateReservationStatus = async (
  reservationId: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED",
  tx = prisma
) => {
  return tx.reservation.updateMany({
    where: { id: reservationId },
    data: { status },
  });
};

const getReservationById = async (reservationId: string) => {
  return prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      showTime: true,
      user: true,
      reservationDetails: { include: { seat: true } },
    },
  });
};

export default {
  createReservation,
  updateReservationStatus,
  getReservationById,
};
