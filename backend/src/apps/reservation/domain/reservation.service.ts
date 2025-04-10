import { BadRequestError, NoDataError } from "../../../core/api-error";
import prisma from "../../../db";
import showTimeRepository from "../../show-time/data-access/show-time.repository";
import reservationRepository from "../data-access/reservation.repository";
import {
  CreateReservationDTO,
  ReservationCreateInput,
} from "./dto/create-reservation.dto";

const reserve = async (newReservationData: CreateReservationDTO) => {
  const { showTimeId, seatIds, userId, count } = newReservationData;

  if (seatIds.length !== count) {
    throw new BadRequestError("Number of selected seats must match the count");
  }

  const seats = await Promise.all(
    seatIds.map((seatId) =>
      showTimeRepository.getShowTimeSeat(showTimeId, seatId)
    )
  );
  if (seats.some((seat) => !seat))
    throw new NoDataError("One or more seats not found");
  if (seats.some((seat) => seat!.status === "RESERVED"))
    throw new BadRequestError("One or more seats already reserved");

  const reservationsData: ReservationCreateInput[] = seatIds.map((seatId) => ({
    userId,
    showTimeId,
    seatId,
    status: "CONFIRMED",
  }));

  const [reservations] = await prisma.$transaction([
    reservationRepository.reserveMany(reservationsData),
    ...seatIds.map((seatId) =>
      showTimeRepository.updateSeatStatus(showTimeId, seatId, "RESERVED")
    ),
  ]);

  return reservations;
};

export default {
  reserve,
};
