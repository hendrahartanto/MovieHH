import { NoDataError } from "../../../core/api-error";
import movieRepository from "../data-access/movie.repository";
import { CreateMovieDTO } from "./dto/create-movie.dto";
import { UpdateMovieDTO } from "./dto/update-movie.dto";

const createMovie = async (createMovieData: CreateMovieDTO) => {
  //TODO: create genre validation maybe
  return movieRepository.createMovie(createMovieData);
};

const updateMovie = async (
  movieId: string,
  updateMovieData: UpdateMovieDTO
) => {
  const existingMovie = await movieRepository.getMovieById(movieId);
  if (!existingMovie) throw new NoDataError("Movie not found");

  const { genreIds, ...updateData } = updateMovieData;
  await movieRepository.updateMovie(movieId, updateData);
  await movieRepository.updateGenres(movieId, genreIds);

  return movieRepository.getMovieById(movieId);
};

const deleteMovie = async (movieId: string) => {
  const existingMovie = await movieRepository.getMovieById(movieId);
  if (!existingMovie) throw new NoDataError("Movie not found");

  return movieRepository.deleteMovie(movieId);
};

export default {
  createMovie,
  updateMovie,
  deleteMovie,
};
