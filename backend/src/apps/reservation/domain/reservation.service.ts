import dayjs from "dayjs";
import {
  BadRequestError,
  NoDataError,
} from "../../../lib/exceptions/api-error";
import { midtransSnap } from "../../../infrastructure/midtrans";
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
  const RESERVATION_HOLD_MINUTES =
    Number(process.env.RESERVATION_HOLD_MINUTES) || 10;

  const reservation =
    await reservationRepository.getReservationById(reservationId);
  if (!reservation) throw new NoDataError("Reservation not found");
  if (reservation.userId !== userId)
    throw new BadRequestError("Unauthorized access to reservation");

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
      start_time: dayjs().format("YYYY-MM-DD HH:mm:ss Z"),
      unit: "minute",
      duration: RESERVATION_HOLD_MINUTES,
    },
  };

  const transaction = await midtransSnap.createTransaction(parameter);

  return {
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
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

  return prisma.$transaction(async (tx) => {
    const jobToRemove = await reservationHoldQueue.getJob(reservation.id);
    if (jobToRemove) {
      await jobToRemove.remove();
    }

    const cancelledReservation =
      await reservationRepository.updateReservationStatus(
        reservationId,
        "CANCELLED",
      );
    await showTimeRepository.updateManySeatStatus(
      reservation.showTimeId,
      reservation.reservationDetails.map((detail) => detail.seatId),
      "AVAILABLE",
    );

    return cancelledReservation;
  });
};

export default {
  createReservationHold,
  createPaymentToken,
  cancelReservation,
};
