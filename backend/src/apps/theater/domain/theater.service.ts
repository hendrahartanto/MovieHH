import seatRepository from "../../seat/data-access/seat.repository";
import theaterRepository from "../data-access/theater.repository";
import { CreateTheaterDTO } from "../dto/create-theater.dto";
import { UpdateTheaterDTO } from "../dto/update-theater.dto";
import { BadRequestError } from "../../../lib/exceptions/api-error";
import prisma from "../../../db";

const createTheater = async (newTheaterData: CreateTheaterDTO) => {
  return prisma.$transaction(async (tx) => {
    const theater = await theaterRepository.createTheater(newTheaterData, tx);
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
      await seatRepository.createSeats(seats, tx);
    }

    return theater;
  });
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

  const layoutChanged =
    updateTheaterData.layout !== undefined &&
    JSON.stringify(updateTheaterData.layout) !== JSON.stringify(existingTheater.layout);

  if (layoutChanged) {
    // 1. Guard check: block if there are any active/future showtimes scheduled for this theater
    const activeShowtimesCount = await prisma.showTime.count({
      where: {
        movieSchedule: { theaterId },
        startTime: { gte: new Date() },
        deletedAt: null,
      },
    });

    if (activeShowtimesCount > 0) {
      throw new BadRequestError(
        "Cannot update layout of a theater with active or upcoming showtimes scheduled. Please create a new theater instead."
      );
    }

    // 2. Perform atomic update in a transaction
    return prisma.$transaction(async (tx) => {
      const updatedTheater = await theaterRepository.updateTheater(
        theaterId,
        updateTheaterData,
        tx
      );

      // Soft-delete old seats
      await tx.seat.updateMany({
        where: { theaterId, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      // Generate and save new seats
      const newLayout = updateTheaterData.layout as number[][];
      const seats = [];
      let validRowCount = 0;

      for (let rowIndex = 0; rowIndex < newLayout.length; rowIndex++) {
        const row = newLayout[rowIndex];
        const isCorridorRow = row.every((val) => val === 0);
        if (isCorridorRow) continue;

        const seatRowChar = String.fromCharCode(65 + validRowCount);
        validRowCount++;

        let seatNumberCounter = 1;
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] === 1) {
            seats.push({
              theaterId,
              seatRow: seatRowChar,
              seatNumber: `${seatNumberCounter}`,
            });
            seatNumberCounter++;
          }
        }
      }

      if (seats.length > 0) {
        await seatRepository.createSeats(seats, tx);
      }

      return updatedTheater;
    });
  }

  // If layout is not changed, perform standard update
  return theaterRepository.updateTheater(theaterId, updateTheaterData);
};

const deleteTheater = async (theaterId: string) => {
  const existingTheater = await theaterRepository.getTheaterById(theaterId);
  if (!existingTheater) throw new Error("Theater not found");

  return prisma.$transaction(async (tx) => {
    // Soft-delete seats
    await tx.seat.updateMany({
      where: { theaterId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    // Soft-delete theater
    return theaterRepository.deleteTheater(theaterId, tx);
  });
};

export default {
  createTheater,
  updateTheater,
  deleteTheater,
  getTheatersPaginated,
  getTheaters,
  getTheater,
};
