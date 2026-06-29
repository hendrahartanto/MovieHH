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

const getReservationsByUserId = async (
  userId: string,
  type: "active" | "history",
  page: number = 1,
  limit: number = 10,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  const now = new Date();
  const whereClause: Prisma.ReservationWhereInput = {
    userId,
    ...(type === "active"
      ? {
          status: "CONFIRMED",
          showTime: {
            startTime: { gte: now },
          },
        }
      : {
          OR: [
            {
              showTime: {
                startTime: { lt: now },
              },
            },
            {
              status: { not: "CONFIRMED" },
            },
          ],
        }),
  };

  const [reservations, total] = await Promise.all([
    tx.reservation.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
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
    }),
    tx.reservation.count({ where: whereClause }),
  ]);

  return { reservations, total };
};

const getReservationsPaginatedAdmin = async (
  page: number,
  limit: number,
  search: string = "",
  status?: string,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  const whereClause: Prisma.ReservationWhereInput = {};

  if (status) {
    whereClause.status = status as any;
  }

  if (search.trim()) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(search.trim());
    whereClause.OR = [
      ...(isUuid ? [{ id: search.trim() }] : []),
      {
        user: {
          name: { contains: search, mode: "insensitive" },
        },
      },
      {
        user: {
          email: { contains: search, mode: "insensitive" },
        },
      },
    ];
  }

  const [reservations, total] = await Promise.all([
    tx.reservation.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
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
    }),
    tx.reservation.count({ where: whereClause }),
  ]);

  return { reservations, total };
};

const checkInReservation = async (
  reservationId: string,
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.reservation.update({
    where: { id: reservationId },
    data: { checkedInAt: new Date() },
    include: {
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
      user: true,
      reservationDetails: { include: { seat: true } },
    },
  });
};

export default {
  createReservation,
  updateReservationStatus,
  expirePendingReservation,
  getReservationById,
  getActivePendingReservationByUserId,
  getReservationsByUserId,
  getPaymentByReservationId,
  createPayment,
  updatePaymentStatusByReservationId,
  checkInReservation,
  getReservationsPaginatedAdmin,
};
