import seatRepository from "../../seat/data-access/seat.repository";
import theaterRepisotry from "../data-access/theater.repisotry";
import { CreateTheaterDTO } from "./dto/create-theater.dto";

const createTheater = async (newTheaterData: CreateTheaterDTO) => {
  const theater = await theaterRepisotry.createTheater(newTheaterData);

  const seats = [];
  for (let row = 1; row <= 3; row++) {
    for (let number = 1; number <= 10; number++) {
      seats.push({
        theaterId: theater.id,
        seatNumber: `${number}`,
        seatRow: String.fromCharCode(64 + row),
      });
    }
  }

  await seatRepository.createSeats(seats);

  return theater;
};

export default {
  createTheater,
};
