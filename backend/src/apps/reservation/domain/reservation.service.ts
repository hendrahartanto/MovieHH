import dayjs from "dayjs";
import {
  BadRequestError,
  NoDataError,
} from "../../../lib/exceptions/api-error";
import {
  cancelMidtransTransaction,
  midtransSnap,
} from "../../../infrastructure/midtrans";
import prisma from "../../../db";
import { reservationHoldQueue } from "../../../queue/reservation-hold-queue";
import showTimeRepository from "../../show-time/data-access/show-time.repository";
import reservationRepository from "../data-access/reservation.repository";
import { CreateReservationHoldDTO } from "../dto/create-reservation-hold.dto";

const createReservationHold = async (
  newReservationHoldData: CreateReservationHoldDTO,
  userId: string,
) => {
  const { showTimeId, seatIds, count } = newReservationHoldData;
  const RESERVATION_HOLD_MINUTES =
    Number(process.env.RESERVATION_HOLD_MINUTES) || 10;

  if (seatIds.length !== count) {
    throw new BadRequestError("Number of selected seats must match the count");
  }

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;

    const activeReservation =
      await reservationRepository.getActivePendingReservationByUserId(
        userId,
        tx,
      );
    if (activeReservation) {
      throw new BadRequestError(
        "You already have an ongoing payment. Complete or cancel it first",
      );
    }

    const showTime = await showTimeRepository.getShowTimeById(showTimeId);
    if (!showTime) throw new NoDataError("Showtime not found");

    const seats = await Promise.all(
      seatIds.map((seatId) =>
        showTimeRepository.getShowTimeSeat(showTimeId, seatId),
      ),
    );
    if (seats.some((seat) => !seat))
      throw new NoDataError("One or more seats not found");
    if (seats.some((seat) => seat!.status === "RESERVED"))
      throw new BadRequestError("One or more seats already reserved");
    if (seats.some((seat) => seat!.status === "HOLD"))
      throw new BadRequestError(
        "Some seats are currently on hold by another user",
      );

    const totalPrice = seats.length * Number(showTime.movieSchedule.price);
    const expiresAt = new Date(
      Date.now() + RESERVATION_HOLD_MINUTES * 60 * 1000,
    );

    const reservation = await reservationRepository.createReservation(
      {
        user: { connect: { id: userId } },
        showTime: { connect: { id: showTimeId } },
        status: "PENDING",
        expiresAt,
        totalPrice,
        reservationDetails: {
          create: seatIds.map((seatId) => ({ seatId })),
        },
      },
      tx,
    );

    const holdResult = await showTimeRepository.holdAvailableSeats(
      showTimeId,
      seatIds,
      tx,
    );
    if (holdResult.count !== seatIds.length) {
      throw new BadRequestError("One or more seats are no longer available");
    }

    await reservationHoldQueue.add(
      "releaseReservationHold",
      {
        reservationId: reservation.id,
        showTimeId,
        seatIds,
      },
      {
        jobId: reservation.id,
        delay: 1000 * 60 * RESERVATION_HOLD_MINUTES,
      },
    );

    return reservation;
  });
};

const createPaymentToken = async (reservationId: string, userId: string) => {
  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${reservationId}))`;

      const reservation = await reservationRepository.getReservationById(
        reservationId,
        tx,
      );
      if (!reservation) throw new NoDataError("Reservation not found");
      if (reservation.userId !== userId)
        throw new BadRequestError("Unauthorized access to reservation");

      if (reservation.status !== "PENDING")
        throw new BadRequestError("Reservation is not payable");

      const now = new Date();
      if (reservation.expiresAt <= now)
        throw new BadRequestError("Reservation has expired");

      const existingPayment =
        await reservationRepository.getPaymentByReservationId(
          reservationId,
          tx,
        );
      if (existingPayment) {
        return existingPayment;
      }

      const remainingHoldMinutes = Math.ceil(
        (reservation.expiresAt.getTime() - now.getTime()) / (60 * 1000),
      );

      const parameter = {
        transaction_details: {
          order_id: reservationId,
          gross_amount: Number(reservation.totalPrice),
        },
        customer_details: {
          first_name: reservation.user.name,
          email: reservation.user.email,
        },
        item_details: reservation.reservationDetails.map((detail) => ({
          id: detail.seatId,
          price: Number(reservation.showTime.movieSchedule.price),
          quantity: 1,
          name: `Seat ${detail.seat.seatRow}${detail.seat.seatNumber}`,
        })),
        credit_card: {
          secure: true,
        },
        expiry: {
          start_time: dayjs(now).format("YYYY-MM-DD HH:mm:ss Z"),
          unit: "minute",
          duration: remainingHoldMinutes,
        },
      };

      const transaction = await midtransSnap.createTransaction(parameter);

      return reservationRepository.createPayment(
        {
          reservation: { connect: { id: reservationId } },
          token: transaction.token,
          redirectUrl: transaction.redirect_url,
        },
        tx,
      );
    },
    { timeout: 15000 },
  );
};

const getActiveReservationPayment = async (userId: string) => {
  const activeReservation =
    await reservationRepository.getActivePendingReservationByUserId(userId);

  if (!activeReservation) {
    return null;
  }

  const { payment, ...reservation } = activeReservation;

  return {
    reservation,
    payment,
  };
};

const cancelReservation = async (reservationId: string, userId: string) => {
  const reservation =
    await reservationRepository.getReservationById(reservationId);
  if (!reservation) throw new NoDataError("Reservation not found");
  if (reservation.userId !== userId)
    throw new BadRequestError("Unauthorized access to reservation");
  if (reservation.status !== "PENDING")
    throw new BadRequestError("Reservation status is not valid");
  if (reservation.payment?.status === "PAID")
    throw new BadRequestError("Paid reservation cannot be cancelled");

  if (reservation.payment?.status === "PENDING") {
    try {
      await cancelMidtransTransaction(reservationId);
    } catch (error: any) {
      // 404 means the transaction was never fully created in Midtrans (Snap popup closed before picking a method).
      // 412 means it cannot be cancelled (e.g., already expired or cancelled).
      const statusCode = error.httpStatusCode || error.ApiResponse?.status_code;
      if (
        statusCode !== 404 &&
        statusCode !== 412 &&
        statusCode !== "404" &&
        statusCode !== "412"
      ) {
        throw new BadRequestError(
          `Failed to cancel payment at Midtrans: ${error.message}`
        );
      }
    }
  }

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${reservationId}))`;

    const currentReservation =
      await reservationRepository.getReservationById(reservationId, tx);
    if (!currentReservation) throw new NoDataError("Reservation not found");
    if (currentReservation.status !== "PENDING")
      throw new BadRequestError("Reservation status is not valid");
    if (currentReservation.payment?.status === "PAID")
      throw new BadRequestError("Paid reservation cannot be cancelled");

    const jobToRemove = await reservationHoldQueue.getJob(reservation.id);
    if (jobToRemove) {
      await jobToRemove.remove();
    }

    const cancelledReservation =
      await reservationRepository.updateReservationStatus(
        reservationId,
        "CANCELLED",
        tx,
      );
    await reservationRepository.updatePaymentStatusByReservationId(
      reservationId,
      "CANCELLED",
      tx,
    );
    await showTimeRepository.updateManySeatStatus(
      currentReservation.showTimeId,
      currentReservation.reservationDetails.map((detail) => detail.seatId),
      "AVAILABLE",
      tx,
    );

    return cancelledReservation;
  });
};

export default {
  createReservationHold,
  createPaymentToken,
  getActiveReservationPayment,
  cancelReservation,
};
