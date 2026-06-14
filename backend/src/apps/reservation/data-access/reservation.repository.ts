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
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.reservation.update({
    where: { id: reservationId },
    data: { status },
  });
};

const expirePendingReservation = async (
  reservationId: string,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.reservation.updateMany({
    where: {
      id: reservationId,
      status: "PENDING",
    },
    data: { status: "EXPIRED" },
  });
};

const getReservationById = async (
  reservationId: string,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.reservation.findUnique({
    where: { id: reservationId },
    include: {
      showTime: { include: { movieSchedule: true } },
      user: true,
      payment: true,
      reservationDetails: { include: { seat: true } },
    },
  });
};

const getActivePendingReservationByUserId = async (
  userId: string,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.reservation.findFirst({
    where: {
      userId,
      status: "PENDING",
      expiresAt: { gt: new Date() },
      OR: [
        { payment: { is: null } },
        { payment: { is: { status: "PENDING" } } },
      ],
    },
    include: {
      payment: true,
      reservationDetails: { include: { seat: true } },
      showTime: {
        include: {
          movieSchedule: {
            include: {
              movie: true,
              theater: { include: { location: true } },
            },
          },
        },
      },
    },
    orderBy: { createAt: "desc" },
  });
};

const getPaymentByReservationId = async (
  reservationId: string,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.payment.findUnique({
    where: { reservationId },
  });
};

const createPayment = async (
  data: Prisma.PaymentCreateInput,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.payment.create({
    data,
  });
};

const updatePaymentStatusByReservationId = async (
  reservationId: string,
  status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "FAILED",
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.payment.updateMany({
    where: { reservationId },
    data: { status },
  });
};

export default {
  createReservation,
  updateReservationStatus,
  expirePendingReservation,
  getReservationById,
  getActivePendingReservationByUserId,
  getPaymentByReservationId,
  createPayment,
  updatePaymentStatusByReservationId,
};
