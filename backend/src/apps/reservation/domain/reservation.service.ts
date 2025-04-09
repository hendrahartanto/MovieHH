import { BadRequestError, NoDataError } from "../../../core/api-error";
import prisma from "../../../db";
import showTimeRepository from "../../show-time/data-access/show-time.repository";
import reservationRepository from "../data-access/reservation.repository";
import { CreateReservationDTO } from "./dto/create-reservation.dto";

const reserve = async (newReservationData: CreateReservationDTO) => {
  const seat = await showTimeRepository.getShowTimeSeat(
    newReservationData.showTimeId,
    newReservationData.seatId
  );
  if (!seat) throw new NoDataError("No seat found");
  if (seat.status === "RESERVED")
    throw new BadRequestError("Seat already reserved");

  const [reservation] = await prisma.$transaction([
    reservationRepository.reserve({
      ...newReservationData,
      status: "CONFIRMED",
    }),
    showTimeRepository.updateSeatStatus(
      newReservationData.showTimeId,
      newReservationData.seatId,
      "RESERVED"
    ),
  ]);

  return reservation;
};

export default {
  reserve,
};
