import { BadRequestError, NoDataError } from "../../../core/api-error";
import prisma from "../../../db";
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
    if (seats.some((seat) => seat!.status !== "AVAILABLE"))
      throw new BadRequestError("One or more seats already reserved");

    const totalPrice = seats.length * showTime.price.toNumber();
    const expiresAt = new Date(
      Date.now() + RESERVATION_HOLD_MINUTES * 60 * 1000
    );

    const reservations = await reservationRepository.reserveMany(
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

    return reservations;
  });
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
  reserve,
};
