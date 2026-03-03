import { BadRequestError, NoDataError } from "../../../lib/exceptions/api-error";
import prisma from "../../../db";
import {
  combineDateAndTime,
  updateDateOnly,
} from "../../../lib/utils/date.util";
import movieRepository from "../../movie/data-access/movie.repository";
import theaterRepository from "../../theater/data-access/theater.repository";
import showTimeRepository from "../data-access/show-time.repository";
import { CreateMovieScheduleDTO } from "../dto/create-movie-schedule.dto";
import { CreateShowTimeSeatsDTO } from "../dto/create-show-time-seats.dto";
import { CreateShowTimeDTO } from "../dto/create-show-time.dto";
import { GetMovieScheduleByDateRangeDTO } from "../dto/get-movie-schedule-by-date-range.dto";
import { GetShowTimesByDateRangeDTO } from "../dto/get-show-times-by-date-range.dto";
import { UpdateMovieScheduleDTO } from "../dto/update-movie-schedule.dto";

const createMovieSchedule = async (
  newMovieScheduleData: CreateMovieScheduleDTO,
) => {
  const { movieId, theaterId, date } = newMovieScheduleData;

  const existingMovie = await movieRepository.getMovieById(movieId);
  if (!existingMovie) throw new NoDataError("Movie not found");

  const existingTheater = await theaterRepository.getTheaterById(theaterId);
  if (!existingTheater) throw new NoDataError("Theater not found");

  const existingMovieSchedule =
    await showTimeRepository.getMovieScheduleByMovieIdAndDateAndTheaterId(
      movieId,
      date,
      theaterId,
    );
  if (existingMovieSchedule)
    throw new BadRequestError(
      "Schedule with the given date, movie, and theater already exists",
    );

  return await showTimeRepository.createMovieSchedule(newMovieScheduleData);
};

const getMovieSchedulesPaginated = async (
  page: number,
  limit: number,
  search: string,
) => {
  return showTimeRepository.getMovieSchedulesPaginated(page, limit, search);
};

const getMovieScheduleByDateRange = async (
  query: GetMovieScheduleByDateRangeDTO,
) => {
  return showTimeRepository.getMovieScheduleByDateRange(
    query.startDate,
    query.endDate,
  );
};

const getMovieScheduleByMovieIdAndDateRange = async (
  movieId: string,
  query: GetMovieScheduleByDateRangeDTO,
) => {
  return showTimeRepository.getMovieScheduleByMovieIdAndDateRange(
    movieId,
    query.startDate,
    query.endDate,
  );
};

const getMovieScheduleByTheaterIdAndDateRange = async (
  theaterId: string,
  query: GetMovieScheduleByDateRangeDTO,
) => {
  return showTimeRepository.getMovieScheduleByTheaterIdAndDateRange(
    theaterId,
    query.startDate,
    query.endDate,
  );
};

const updateMovieSchedule = async (
  movieScheduleId: string,
  updatedMovieSchedule: UpdateMovieScheduleDTO,
) => {
  const existingMovieSchedule =
    await showTimeRepository.getMovieScheduleById(movieScheduleId);
  if (!existingMovieSchedule) throw new NoDataError("Movie schedule not found");

  const conflictedMovieSchedule =
    await showTimeRepository.getMovieScheduleByMovieIdAndDateAndTheaterId(
      updatedMovieSchedule.movieId,
      updatedMovieSchedule.date,
      updatedMovieSchedule.theaterId,
    );
  if (conflictedMovieSchedule)
    throw new BadRequestError(
      "Schedule with the given date, movie, and theater already exists",
    );

  const updatedShowTimes = existingMovieSchedule.showTimes.map((st) => {
    const newStart = updateDateOnly(st.startTime, updatedMovieSchedule.date);
    const newEnd = updateDateOnly(st.endTime, updatedMovieSchedule.date);
    return { ...st, startTime: newStart, endTime: newEnd };
  });

  for (const st of updatedShowTimes) {
    const overlapping = await showTimeRepository.getOverlappingShowTime(
      updatedMovieSchedule.theaterId,
      st.startTime,
      st.endTime,
    );

    if (overlapping && overlapping.id !== st.id) {
      throw new BadRequestError(
        `ShowTime conflict detected at (${overlapping.startTime} - ${overlapping.endTime})`,
      );
    }
  }

  return prisma.$transaction(async (tx) => {
    for (const st of updatedShowTimes) {
      await showTimeRepository.updateShowTime(tx, st.id, {
        startTime: st.startTime,
        endTime: st.endTime,
      });
    }

    const updatedSchedule = await showTimeRepository.updateMovieSchedule(
      tx,
      movieScheduleId,
      updatedMovieSchedule,
    );

    return updatedSchedule;
  });
};

const deleteMovieSchedule = async (movieScheduleId: string) => {
  return showTimeRepository.deleteMovieSchedule(movieScheduleId);
};

const createShowTime = async (newShowTimeData: CreateShowTimeDTO) => {
  const existingMovieSchedule = await showTimeRepository.getMovieScheduleById(
    newShowTimeData.movieScheduleId,
  );
  if (!existingMovieSchedule) throw new NoDataError("Movie schedule not found");

  const startTime = combineDateAndTime(
    existingMovieSchedule.date,
    newShowTimeData.startTime,
  );
  const endTime = combineDateAndTime(
    existingMovieSchedule.date,
    newShowTimeData.endTime,
  );

  if (startTime > endTime)
    throw new BadRequestError("Start time must be before end time");

  const overlappingShowTime = await showTimeRepository.getOverlappingShowTime(
    existingMovieSchedule.theaterId,
    startTime,
    endTime,
  );

  if (overlappingShowTime)
    throw new BadRequestError(
      "Showtime overlap with existing schedule in given theater",
    );

  const newShowTime = await showTimeRepository.createShowTime({
    ...newShowTimeData,
    startTime,
    endTime,
  });

  const seatsMapping: CreateShowTimeSeatsDTO[] = [];
  existingMovieSchedule.theater.seats.forEach((seat) => {
    seatsMapping.push({
      showTimeId: newShowTime.id,
      seatId: seat.id,
    });
  });

  await showTimeRepository.createShowTimeSeats(seatsMapping);

  return newShowTime;
};

const getShowTimeByDateRange = async (query: GetShowTimesByDateRangeDTO) => {
  return showTimeRepository.getShowTimeByDateRange(
    query.startDate,
    query.endDate,
  );
};

const getShowTimeByMovieScheduleId = async (movieScheduleId: string) => {
  return showTimeRepository.getShowTimeByMovieScheduleId(movieScheduleId);
};

const getShowTimeSeats = async (showTimeId: string) => {
  const existingShowTime = await showTimeRepository.getShowTimeById(showTimeId);
  if (!existingShowTime) throw new BadRequestError("Showtime not found");

  return showTimeRepository.getShowTimeSeats(showTimeId);
};

const deleteShowTime = async (showTimeId: string) => {
  const existingShowTime = await showTimeRepository.getShowTimeById(showTimeId);
  if (!existingShowTime) throw new BadRequestError("Showtime not found");

  return showTimeRepository.deleteShowTime(showTimeId);
};

const getShowTimeById = async (showTimeId: string) => {
  const showTime = await showTimeRepository.getShowTimeById(showTimeId);
  if (!showTime) throw new NoDataError("Showtime not found");
  return showTime;
};

export default {
  createMovieSchedule,
  createShowTime,
  getMovieScheduleByDateRange,
  getShowTimeByDateRange,
  getShowTimeById,
  getShowTimeSeats,
  getMovieSchedulesPaginated,
  deleteMovieSchedule,
  updateMovieSchedule,
  getShowTimeByMovieScheduleId,
  deleteShowTime,
  getMovieScheduleByMovieIdAndDateRange,
  getMovieScheduleByTheaterIdAndDateRange,
};
