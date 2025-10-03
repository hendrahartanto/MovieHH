import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../../db";
import { CreateShowTimeSeatsDTO } from "../domain/dto/create-show-time-seats.dto.ts";
import { CreateShowTimeDTO } from "../domain/dto/create-show-time.dto";
import { CreateMovieScheduleDTO } from "../domain/dto/create-movie-schedule.dto";
import { endOfDay, startOfDay } from "date-fns";

const createMovieSchedule = (newMovieScheduleData: CreateMovieScheduleDTO) => {
  return prisma.movieSchedule.create({ data: newMovieScheduleData });
};

const getMovieSchedulesPaginated = async (
  page: number,
  limit: number,
  search: string
) => {
  const whereClause: Prisma.MovieScheduleWhereInput = {
    movie: {
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
  };

  const [movieSchedules, total] = await Promise.all([
    prisma.movieSchedule.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: { movie: true, theater: true, showTimes: true },
    }),
    prisma.movieSchedule.count({ where: whereClause }),
  ]);

  return { movieSchedules, total };
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

const getMovieScheduleByDateRange = async (
  startDate: string,
  endDate: string
) => {
  const startOfDay = new Date(`${startDate}T00:00:00.000Z`);
  const endOfDay = new Date(`${endDate}T23:59:59.999Z`);

  return prisma.movieSchedule.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
    },
    include: {
      movie: true,
      showTimes: true,
      theater: true,
    },
  });
};

const getMovieScheduleByMovieIdAndDate = (movieId: string, date: Date) => {
  const start = startOfDay(date);
  const end = endOfDay(date);

  return prisma.movieSchedule.findFirst({
    where: {
      date: { gte: start, lte: end },
      movieId,
    },
  });
};

const updateMovieSchedule = async (
  tx: PrismaClient | Prisma.TransactionClient = prisma,
  movieScheduleId: string,
  data: {
    movieId: string;
    theaterId: string;
    date: Date;
    price: number;
  }
) => {
  return tx.movieSchedule.update({
    where: { id: movieScheduleId },
    data,
  });
};

const updateShowTime = async (
  tx: PrismaClient | Prisma.TransactionClient = prisma,
  showTimeId: string,
  data: { startTime: Date; endTime: Date }
) => {
  return tx.showTime.update({
    where: { id: showTimeId },
    data,
  });
};

const deleteMovieSchedule = async (movieScheduleId: string) => {
  return prisma.movieSchedule.delete({ where: { id: movieScheduleId } });
};

const createShowTime = async (newShowTimeData: {
  movieScheduleId: string;
  startTime: Date;
  endTime: Date;
}) => {
  return prisma.showTime.create({ data: newShowTimeData });
};

const getShowTimeByDateRange = async (startDate: string, endDate: string) => {
  const startOfDay = new Date(`${startDate}T00:00:00.000Z`);
  const endOfDay = new Date(`${endDate}T23:59:59.999Z`);

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
  theaterId: string,
  startTime: Date,
  endTime: Date
) => {
  return prisma.showTime.findFirst({
    where: {
      movieSchedule: { theaterId },
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
  getMovieScheduleByMovieIdAndDate,
  getMovieScheduleByDateRange,
  getShowTimeByDateRange,
  getShowTimeById,
  getOverlappingShowTime,
  createShowTimeSeats,
  getShowTimeSeats,
  getShowTimeSeat,
  updateSeatStatus,
  updateManySeatStatus,
  getMovieSchedulesPaginated,
  deleteMovieSchedule,
  updateMovieSchedule,
  updateShowTime,
};
