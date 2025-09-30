import { BadRequestError, NoDataError } from "../../../core/api-error";
import movieRepository from "../../movie/data-access/movie.repository";
import theaterRepisotry from "../../theater/data-access/theater.repisotry";
import showTimeRepository from "../data-access/show-time.repository";
import { CreateMovieScheduleDTO } from "./dto/create-movie-schedule.dto";
import { CreateShowTimeSeatsDTO } from "./dto/create-show-time-seats.dto.ts";
import { CreateShowTimeDTO } from "./dto/create-show-time.dto";
import { GetMovieScheduleByDateRangeDTO } from "./dto/get-movie-schedule-by-date-range.dto";
import { GetShowTimesByDateRangeDTO } from "./dto/get-show-times-by-date-range.dto";

const createMovieSchedule = async (
  newMovieScheduleData: CreateMovieScheduleDTO
) => {
  const { movieId, theaterId, date } = newMovieScheduleData;

  const existingMovie = await movieRepository.getMovieById(movieId);
  if (!existingMovie) throw new NoDataError("Movie not found");

  const existingTheater = await theaterRepisotry.getTheaterById(theaterId);
  if (!existingTheater) throw new NoDataError("Theater not found");

  const existingMovieSchedule =
    await showTimeRepository.getMovieScheduleByMovieIdAndDate(movieId, date);
  if (existingMovieSchedule)
    throw new BadRequestError(
      "Schedule with the given date and movie already exists"
    );

  return await showTimeRepository.createMovieSchedule(newMovieScheduleData);
};

const createShowTime = async (newShowTimeData: CreateShowTimeDTO) => {
  const existingMovieSchedule = await showTimeRepository.getMovieScheduleById(
    newShowTimeData.movieScheduleId
  );
  if (!existingMovieSchedule) throw new NoDataError("Movie schedule not found");

  if (newShowTimeData.startTime > newShowTimeData.endTime)
    throw new BadRequestError("Start time must be before end time");

  const overlappingShowTime = await showTimeRepository.getOverlappingShowTime(
    existingMovieSchedule.theaterId,
    newShowTimeData.startTime,
    newShowTimeData.endTime
  );

  if (overlappingShowTime)
    throw new BadRequestError(
      "Showtime overlap with existing schedule in given theater"
    );

  const newShowTime = await showTimeRepository.createShowTime(newShowTimeData);

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

const getMovieScheduleByDateRange = async (
  query: GetMovieScheduleByDateRangeDTO
) => {
  return showTimeRepository.getMovieScheduleByDateRange(
    query.startDate,
    query.endDate
  );
};

const getShowTimeByDateRange = async (query: GetShowTimesByDateRangeDTO) => {
  return showTimeRepository.getShowTimeByDateRange(
    query.startDate,
    query.endDate
  );
};

const getShowTimeSeats = async (showTimeId: string) => {
  const existingShowTime = await showTimeRepository.getShowTimeById(showTimeId);
  if (!existingShowTime) throw new BadRequestError("Showtime not found");

  return showTimeRepository.getShowTimeSeats(showTimeId);
};

export default {
  createMovieSchedule,
  createShowTime,
  getMovieScheduleByDateRange,
  getShowTimeByDateRange,
  getShowTimeSeats,
};
