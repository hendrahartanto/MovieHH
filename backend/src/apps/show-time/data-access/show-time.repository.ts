import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../../db";
import { CreateShowTimeSeatsDTO } from "../domain/dto/create-show-time-seats.dto.ts";
import { CreateShowTimeDTO } from "../domain/dto/create-show-time.dto";
import { CreateMovieScheduleDTO } from "../domain/dto/create-movie-schedule.dto";

const createMovieSchedule = (newMovieScheduleData: CreateMovieScheduleDTO) => {
  return prisma.movieSchedule.create({ data: newMovieScheduleData });
};

const getMovieScheduleById = (movieScheduleId: string) => {
  return prisma.movieSchedule.findUnique({
    where: { id: movieScheduleId },
    include: {
      movie: true,
      showTimes: true,
      theater: { include: { seats: true } },
    },
  });
};

const createShowTime = async (newShowTimeData: CreateShowTimeDTO) => {
  return prisma.showTime.create({ data: newShowTimeData });
};

const getShowTimeByDate = async (date: string) => {
  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  return prisma.showTime.findMany({
    where: {
      startTime: { gte: startOfDay, lte: endOfDay },
    },
    include: {
      movieSchedule: { include: { movie: true, theater: true } },
    },
  });
};

const getOverlappingShowTime = async (
  movieScheduleId: string,
  startTime: Date,
  endTime: Date
) => {
  return prisma.showTime.findFirst({
    where: {
      movieScheduleId,
      startTime: { lte: endTime },
      endTime: { gte: startTime },
    },
  });
};

const getShowTimeById = async (showTimeId: string) => {
  return prisma.showTime.findUnique({
    where: { id: showTimeId },
    include: { movieSchedule: true },
  });
};

const createShowTimeSeats = async (mappingDatas: CreateShowTimeSeatsDTO[]) => {
  return prisma.seatsOnShowTimes.createMany({ data: mappingDatas });
};

const getShowTimeSeats = async (showTimeId: string) => {
  return prisma.seatsOnShowTimes.findMany({
    where: { showTimeId },
    include: { seat: true },
  });
};

const getShowTimeSeat = async (showTimeId: string, seatId: string) => {
  return prisma.seatsOnShowTimes.findUnique({
    where: {
      seatId_showTimeId: {
        seatId,
        showTimeId,
      },
    },
    include: {
      seat: true,
    },
  });
};

const updateSeatStatus = (
  showTimeId: string,
  seatId: string,
  status: "RESERVED" | "AVAILABLE" | "HOLD"
) => {
  return prisma.seatsOnShowTimes.update({
    where: { seatId_showTimeId: { seatId, showTimeId } },
    data: { status },
  });
};

const updateManySeatStatus = async (
  showTimeId: string,
  seatIds: string[],
  status: "RESERVED" | "AVAILABLE" | "HOLD",
  tx: PrismaClient | Prisma.TransactionClient = prisma
) => {
  return tx.seatsOnShowTimes.updateMany({
    where: { showTimeId, seatId: { in: seatIds } },
    data: { status },
  });
};

export default {
  createMovieSchedule,
  getMovieScheduleById,
  createShowTime,
  getShowTimeByDate,
  getShowTimeById,
  getOverlappingShowTime,
  createShowTimeSeats,
  getShowTimeSeats,
  getShowTimeSeat,
  updateSeatStatus,
  updateManySeatStatus,
};
