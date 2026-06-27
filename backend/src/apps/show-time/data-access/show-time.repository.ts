import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../../db";
import { CreateShowTimeSeatsDTO } from "../dto/create-show-time-seats.dto";
import { CreateShowTimeDTO } from "../dto/create-show-time.dto";
import { CreateMovieScheduleDTO } from "../dto/create-movie-schedule.dto";
import { endOfDay, startOfDay } from "date-fns";

type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient | any;

const createMovieSchedule = (newMovieScheduleData: CreateMovieScheduleDTO, tx: any = prisma) => {
  return tx.movieSchedule.create({ data: newMovieScheduleData });
};

const getMovieSchedulesPaginated = async (
  page: number,
  limit: number,
  search: string,
) => {
  const whereClause: Prisma.MovieScheduleWhereInput = {
    movie: {
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
    deletedAt: null,
  };

  const [movieSchedules, total] = await Promise.all([
    prisma.movieSchedule.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        movie: true,
        theater: true,
        showTimes: { where: { deletedAt: null } },
      },
    }),
    prisma.movieSchedule.count({ where: whereClause }),
  ]);

  return { movieSchedules, total };
};

const getMovieScheduleById = (movieScheduleId: string) => {
  return prisma.movieSchedule.findFirst({
    where: { id: movieScheduleId, deletedAt: null },
    include: {
      movie: true,
      showTimes: { where: { deletedAt: null } },
      theater: { include: { seats: { where: { deletedAt: null } } } },
    },
  });
};

const getMovieScheduleByDateRange = async (
  startDate: string,
  endDate: string,
) => {
  const startOfDayVal = new Date(`${startDate}T00:00:00.000Z`);
  const endOfDayVal = new Date(`${endDate}T23:59:59.999Z`);

  return prisma.movieSchedule.findMany({
    where: {
      date: { gte: startOfDayVal, lte: endOfDayVal },
      deletedAt: null,
    },
    include: {
      movie: true,
      showTimes: { where: { deletedAt: null } },
      theater: true,
    },
  });
};

const getMovieScheduleByMovieIdAndDateRange = async (
  movieId: string,
  startDate: string,
  endDate: string,
) => {
  const startOfDayVal = new Date(`${startDate}T00:00:00.000Z`);
  const endOfDayVal = new Date(`${endDate}T23:59:59.999Z`);

  return prisma.movieSchedule.findMany({
    where: {
      movieId: movieId,
      date: { gte: startOfDayVal, lte: endOfDayVal },
      deletedAt: null,
    },
    include: {
      movie: true,
      showTimes: {
        where: { deletedAt: null },
        include: {
          seats: { where: { seat: { deletedAt: null } } },
        },
      },
      theater: {
        include: {
          location: true,
        },
      },
    },
  });
};

const getMovieScheduleByMovieIdAndDateAndTheaterId = (
  movieId: string,
  date: Date,
  theaterId: string,
) => {
  const start = startOfDay(date);
  const end = endOfDay(date);

  return prisma.movieSchedule.findFirst({
    where: {
      date: { gte: start, lte: end },
      movieId,
      theaterId,
      deletedAt: null,
    },
    include: {
      movie: true,
      showTimes: {
        where: { deletedAt: null },
        include: {
          seats: { where: { seat: { deletedAt: null } } },
        },
      },
      theater: {
        include: {
          location: true,
        },
      },
    },
  });
};

const updateMovieSchedule = async (
  tx: PrismaClientOrTransaction = prisma,
  movieScheduleId: string,
  data: {
    movieId: string;
    theaterId: string;
    date: Date;
    price: number;
  },
) => {
  return tx.movieSchedule.update({
    where: { id: movieScheduleId },
    data,
    include: { showTimes: true, theater: true, movie: true },
  });
};

const updateShowTime = async (
  tx: PrismaClientOrTransaction = prisma,
  showTimeId: string,
  data: { startTime: Date; endTime: Date },
) => {
  return tx.showTime.update({
    where: { id: showTimeId },
    data,
  });
};

const deleteMovieSchedule = async (movieScheduleId: string, tx: any = prisma) => {
  return tx.$transaction(async (t: any) => {
    await t.showTime.updateMany({
      where: { movieScheduleId },
      data: { deletedAt: new Date() },
    });
    return t.movieSchedule.update({
      where: { id: movieScheduleId },
      data: { deletedAt: new Date() },
    });
  });
};

const createShowTime = async (
  newShowTimeData: {
    movieScheduleId: string;
    startTime: Date;
    endTime: Date;
  },
  tx: any = prisma,
) => {
  return tx.showTime.create({ data: newShowTimeData });
};

const getShowTimeByDateRange = async (startDate: string, endDate: string) => {
  const startOfDayVal = new Date(`${startDate}T00:00:00.000Z`);
  const endOfDayVal = new Date(`${endDate}T23:59:59.999Z`);

  return prisma.showTime.findMany({
    where: {
      startTime: { gte: startOfDayVal, lte: endOfDayVal },
      deletedAt: null,
    },
    include: {
      movieSchedule: { include: { movie: true, theater: true } },
    },
  });
};

const getOverlappingShowTime = async (
  theaterId: string,
  startTime: Date,
  endTime: Date,
) => {
  return prisma.showTime.findFirst({
    where: {
      movieSchedule: { theaterId },
      startTime: { lte: endTime },
      endTime: { gte: startTime },
      deletedAt: null,
    },
  });
};

const getShowTimeById = async (showTimeId: string) => {
  return prisma.showTime.findFirst({
    where: { id: showTimeId, deletedAt: null },
    include: {
      movieSchedule: {
        include: {
          theater: { include: { location: true } },
          movie: true,
        },
      },
    },
  });
};

const getShowTimeByMovieScheduleId = async (movieScheduleId: string) => {
  return prisma.showTime.findMany({
    where: { movieScheduleId, deletedAt: null },
  });
};

const createShowTimeSeats = async (mappingDatas: CreateShowTimeSeatsDTO[], tx: any = prisma) => {
  return tx.seatsOnShowTimes.createMany({ data: mappingDatas });
};

const getShowTimeSeats = async (showTimeId: string) => {
  return prisma.seatsOnShowTimes.findMany({
    where: { showTimeId, seat: { deletedAt: null } },
    include: { seat: true },
  });
};

const getShowTimeSeat = async (showTimeId: string, seatId: string) => {
  return prisma.seatsOnShowTimes.findFirst({
    where: {
      seatId,
      showTimeId,
      seat: { deletedAt: null },
    },
    include: {
      seat: true,
    },
  });
};

const deleteShowTime = async (showTimeId: string, tx: any = prisma) => {
  return tx.showTime.update({
    where: { id: showTimeId },
    data: { deletedAt: new Date() },
  });
};

const updateSeatStatus = (
  showTimeId: string,
  seatId: string,
  status: "RESERVED" | "AVAILABLE" | "HOLD",
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
  tx: PrismaClientOrTransaction = prisma,
) => {
  return tx.seatsOnShowTimes.updateMany({
    where: { showTimeId, seatId: { in: seatIds } },
    data: { status },
  });
};

const releaseHeldSeats = async (
  showTimeId: string,
  seatIds: string[],
  tx: PrismaClientOrTransaction = prisma,
) => {
  return tx.seatsOnShowTimes.updateMany({
    where: {
      showTimeId,
      seatId: { in: seatIds },
      status: "HOLD",
    },
    data: { status: "AVAILABLE" },
  });
};

const holdAvailableSeats = async (
  showTimeId: string,
  seatIds: string[],
  tx: PrismaClientOrTransaction = prisma,
) => {
  return tx.seatsOnShowTimes.updateMany({
    where: {
      showTimeId,
      seatId: { in: seatIds },
      status: "AVAILABLE",
    },
    data: { status: "HOLD" },
  });
};

const getMovieScheduleByTheaterIdAndDateRange = async (
  theaterId: string,
  startDate: string,
  endDate: string,
) => {
  const startOfDayVal = new Date(`${startDate}T00:00:00.000Z`);
  const endOfDayVal = new Date(`${endDate}T23:59:59.999Z`);

  return prisma.movieSchedule.findMany({
    where: {
      theaterId: theaterId,
      date: { gte: startOfDayVal, lte: endOfDayVal },
      deletedAt: null,
    },
    include: {
      movie: true,
      showTimes: {
        where: { deletedAt: null },
        include: {
          seats: { where: { seat: { deletedAt: null } } },
        },
      },
      theater: {
        include: {
          location: true,
        },
      },
    },
  });
};

export default {
  createMovieSchedule,
  getMovieScheduleById,
  createShowTime,
  getMovieScheduleByMovieIdAndDateAndTheaterId,
  getMovieScheduleByDateRange,
  getShowTimeByDateRange,
  getShowTimeById,
  getOverlappingShowTime,
  createShowTimeSeats,
  getShowTimeSeats,
  getShowTimeSeat,
  updateSeatStatus,
  updateManySeatStatus,
  releaseHeldSeats,
  holdAvailableSeats,
  getMovieSchedulesPaginated,
  deleteMovieSchedule,
  updateMovieSchedule,
  updateShowTime,
  getShowTimeByMovieScheduleId,
  deleteShowTime,
  getMovieScheduleByMovieIdAndDateRange,
  getMovieScheduleByTheaterIdAndDateRange,
};
