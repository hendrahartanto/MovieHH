import { BadRequestError, NoDataError } from "../../../core/api-error";
import movieRepository from "../../movie/data-access/movie.repository";
import showTimeRepository from "../data-access/show-time.repository";
import { CreateShowTimeDTO } from "./dto/create-show-time.dto";
import { GetShowTimesByDateDTO } from "./dto/get-show-times-by-date.dto";

const createShowTime = async (newShowTimeData: CreateShowTimeDTO) => {
  const existingMovie = await movieRepository.getMovieById(
    newShowTimeData.movieId
  );
  if (!existingMovie) throw new NoDataError("Movie not found");

  //TODO: bikin validasi existing theater

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

  return showTimeRepository.createShowTime(newShowTimeData);
};

const getShowTimeByDate = async (query: GetShowTimesByDateDTO) => {
  return showTimeRepository.getShowTimeByDate(query.date);
};

export default {
  createShowTime,
  getShowTimeByDate,
};
