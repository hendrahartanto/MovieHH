import seatRepository from "../../seat/data-access/seat.repository";
import theaterRepository from "../data-access/theater.repository";
import { CreateTheaterDTO } from "../dto/create-theater.dto";
import { UpdateTheaterDTO } from "../dto/update-theater.dto";

const createTheater = async (newTheaterData: CreateTheaterDTO) => {
  const theater = await theaterRepository.createTheater(newTheaterData);
  const layout = newTheaterData.layout as number[][];

  const seats = [];
  let validRowCount = 0;

  for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
    const row = layout[rowIndex];

    const isCorridorRow = row.every((val) => val === 0);
    if (isCorridorRow) continue;

    const seatRowChar = String.fromCharCode(65 + validRowCount); // A, B, C...
    validRowCount++;

    let seatNumberCounter = 1;
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      if (row[colIndex] === 1) {
        seats.push({
          theaterId: theater.id,
          seatRow: seatRowChar,
          seatNumber: `${seatNumberCounter}`,
        });
        seatNumberCounter++;
      }
    }
  }

  if (seats.length > 0) {
    await seatRepository.createSeats(seats);
  }

  return theater;
};

const getTheatersPaginated = async (
  page: number,
  limit: number,
  search: string,
) => {
  return theaterRepository.getTheatersPaginated(page, limit, search);
};

const getTheaters = async () => {
  return theaterRepository.getTheaters();
};

const getTheater = async (theaterId: string) => {
  const theater = await theaterRepository.getTheaterById(theaterId);
  if (!theater) throw new Error("Theater not found");
  return theater;
};

const updateTheater = async (
  theaterId: string,
  updateTheaterData: UpdateTheaterDTO,
) => {
  const existingTheater = await theaterRepository.getTheaterById(theaterId);
  if (!existingTheater) throw new Error("Theater not found");

  return theaterRepository.updateTheater(theaterId, updateTheaterData);
};

const deleteTheater = async (theaterId: string) => {
  const existingTheater = await theaterRepository.getTheaterById(theaterId);
  if (!existingTheater) throw new Error("Theater not found");

  return theaterRepository.deleteTheater(theaterId);
};

export default {
  createTheater,
  updateTheater,
  deleteTheater,
  getTheatersPaginated,
  getTheaters,
  getTheater,
};
