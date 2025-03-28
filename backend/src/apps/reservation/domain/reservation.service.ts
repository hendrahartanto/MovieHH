import reservationRepository from "../data-access/reservation.repository";
import { CreateReservationDTO } from "./dto/create-reservation.dto";

const reserve = async (newReservationData: CreateReservationDTO) => {
  //TODO: buat beberapa business validation disini

  return reservationRepository.reserve(newReservationData);
};

export default {
  reserve,
};
