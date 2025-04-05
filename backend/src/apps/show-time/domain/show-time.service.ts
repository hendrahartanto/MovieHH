import { BadRequestError, NoDataError } from "../../../core/api-error";
import movieRepository from "../../movie/data-access/movie.repository";
import { CreateSeatDTO } from "../../seat/domain/dto/create-seat.dto";
import theaterRepisotry from "../../theater/data-access/theater.repisotry";
import showTimeRepository from "../data-access/show-time.repository";
import { CreateShowTimeSeatsDTO } from "./dto/create-show-time-seats.dto.ts";
import { CreateShowTimeDTO } from "./dto/create-show-time.dto";
import { GetShowTimesByDateDTO } from "./dto/get-show-times-by-date.dto";

const createShowTime = async (newShowTimeData: CreateShowTimeDTO) => {
  const existingMovie = await movieRepository.getMovieById(
    newShowTimeData.movieId
  );
  if (!existingMovie) throw new NoDataError("Movie not found");

  const existingTheater = await theaterRepisotry.getTheaterById(
    newShowTimeData.theaterId
  );
  if (!existingTheater) throw new NoDataError("Theater not found");

  if (newShowTimeData.startTime > newShowTimeData.endTime)
    throw new BadRequestError("Start time must be before end time");

  const overlappingShowTime = await showTimeRepository.getOverlappingShowTime(
    newShowTimeData.theaterId,
    newShowTimeData.startTime,
    newShowTimeData.endTime
  );

  if (overlappingShowTime)
    throw new BadRequestError(
      "Showtime overlap with existing schedule in given theater"
    );

  const newShowTime = await showTimeRepository.createShowTime(newShowTimeData);

  const seatsMapping: CreateShowTimeSeatsDTO[] = [];
  existingTheater.seats.forEach((seat) => {
    seatsMapping.push({
      showTimeId: newShowTime.id,
      seatId: seat.id,
    });
  });

  await showTimeRepository.createShowTimeSeats(seatsMapping);

  return newShowTime;
};

const getShowTimeByDate = async (query: GetShowTimesByDateDTO) => {
  return showTimeRepository.getShowTimeByDate(query.date);
};

const getShowTimeSeats = async (showTimeId: string) => {
  return showTimeRepository.getShowTimeSeats(showTimeId);
};

export default {
  createShowTime,
  getShowTimeByDate,
  getShowTimeSeats,
};
