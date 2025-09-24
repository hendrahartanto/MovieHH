import dayjs from "dayjs";
import { BadRequestError, NoDataError } from "../../../core/api-error";
import { midtransSnap } from "../../../core/midtrans";
import prisma from "../../../db";
import { reservationHoldQueue } from "../../../queue/reservation-hold-queue";
import showTimeRepository from "../../show-time/data-access/show-time.repository";
import reservationRepository from "../data-access/reservation.repository";
import { CreateReservationHoldDTO } from "./dto/create-reservation-hold.dto";
import { CreateReservationDTO } from "./dto/create-reservation.dto";

const createReservationHold = async (
  newReservationHoldData: CreateReservationHoldDTO,
  userId: string
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
        showTimeRepository.getShowTimeSeat(showTimeId, seatId)
      )
    );
    if (seats.some((seat) => !seat))
      throw new NoDataError("One or more seats not found");
    if (seats.some((seat) => seat!.status === "RESERVED"))
      throw new BadRequestError("One or more seats already reserved");
    if (seats.some((seat) => seat!.status === "HOLD"))
      throw new BadRequestError(
        "Some seats are currently on hold by another user"
      );

    const totalPrice = seats.length * showTime.price.toNumber();
    const expiresAt = new Date(
      Date.now() + RESERVATION_HOLD_MINUTES * 60 * 1000
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
      tx
    );

    await showTimeRepository.updateManySeatStatus(
      showTimeId,
      seatIds,
      "HOLD",
      tx
    );

    await reservationHoldQueue.add(
      "releaseReservationHold",
      {
        reservationId: reservation.id,
        showTimeId,
        seatIds,
      },
      {
        delay: 1000 * 60 * RESERVATION_HOLD_MINUTES,
      }
    );

    return reservation;
  });
};

const createPaymentToken = async (reservationId: string, userId: string) => {
  const RESERVATION_HOLD_MINUTES =
    Number(process.env.RESERVATION_HOLD_MINUTES) || 10;

  const reservation = await reservationRepository.getReservationById(
    reservationId
  );
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
      price: reservation.showTime.price.toNumber(),
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

const reserve = async (
  newReservationData: CreateReservationDTO,
  userId: string
) => {
  //TODO: rombak logic untuk confirm reserve ke trigger setelah berhasil bayar
  // const { showTimeId, seatIds, count } = newReservationData;
  // if (seatIds.length !== count) {
  //   throw new BadRequestError("Number of selected seats must match the count");
  // }
  // const showTime = await showTimeRepository.getShowTimeById(showTimeId);
  // if (!showTime) throw new NoDataError("Showtime not found");
  // const seats = await Promise.all(
  //   seatIds.map((seatId) =>
  //     showTimeRepository.getShowTimeSeat(showTimeId, seatId)
  //   )
  // );
  // if (seats.some((seat) => !seat))
  //   throw new NoDataError("One or more seats not found");
  // if (seats.some((seat) => seat!.status === "RESERVED"))
  //   throw new BadRequestError("One or more seats already reserved");
  // const reservationsData: ReservationCreateInput[] = seatIds.map((seatId) => ({
  //   userId,
  //   showTimeId,
  //   seatId,
  //   status: "CONFIRMED",
  // }));
  // const [reservations] = await prisma.$transaction([
  //   reservationRepository.reserveMany(reservationsData),
  //   ...seatIds.map((seatId) =>
  //     showTimeRepository.updateSeatStatus(showTimeId, seatId, "RESERVED")
  //   ),
  // ]);
  // return reservations;
};

export default {
  createReservationHold,
  createPaymentToken,
  reserve,
};
