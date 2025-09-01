import seatRepository from "../../seat/data-access/seat.repository";
import theaterRepisotry from "../data-access/theater.repisotry";
import { CreateTheaterDTO } from "./dto/create-theater.dto";
import { UpdateTheaterDTO } from "./dto/update-theater.dto";

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

const getTheatersPaginated = async (page: number, limit: number) => {
  return theaterRepisotry.getTheatersPaginated(page, limit);
};

const getTheaters = async () => {
  return theaterRepisotry.getTheaters();
};

const updateTheater = async (
  theaterId: string,
  updateTheaterData: UpdateTheaterDTO
) => {
  const existingTheater = await theaterRepisotry.getTheaterById(theaterId);
  if (!existingTheater) throw new Error("Theater not found");

  return theaterRepisotry.updateTheater(theaterId, updateTheaterData);
};

const deleteTheater = async (theaterId: string) => {
  const existingTheater = await theaterRepisotry.getTheaterById(theaterId);
  if (!existingTheater) throw new Error("Theater not found");

  return theaterRepisotry.deleteTheater(theaterId);
};

const searchTheaters = async (query: string, page: number, limit: number) => {
  return theaterRepisotry.searchTheaters(query, page, limit);
};

export default {
  createTheater,
  updateTheater,
  deleteTheater,
  getTheatersPaginated,
  getTheaters,
  searchTheaters,
};
