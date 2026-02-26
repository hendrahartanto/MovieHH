import { BadRequestError, NoDataError } from "../../../lib/exceptions/api-error";
import genreRepository from "../../genre/data-access/genre.repository";
import movieRepository from "../data-access/movie.repository";
import { CreateMovieDTO } from "./dto/create-movie.dto";
import { UpdateMovieDTO } from "./dto/update-movie.dto";

const createMovie = async (createMovieData: CreateMovieDTO) => {
  const { genreIds } = createMovieData;

  for (const genreId of genreIds) {
    const genre = await genreRepository.getGenreById(genreId);
    if (!genre) throw new BadRequestError("On of the genre is not found");
  }

  return movieRepository.createMovie(createMovieData);
};

const getMovies = async (page: number, limit: number, search: string) => {
  return movieRepository.getMovies(page, limit, search);
};

const getMovie = async (movieId: string) => {
  const movie = movieRepository.getMovieById(movieId);
  if (!movie) throw new BadRequestError("Movie not found");

  return movie;
};

const getFeaturedMovies = async () => {
  return movieRepository.getFeaturedMovies();
};

const getActiveMovies = async () => {
  return movieRepository.getActiveMovies();
}

const getUpcomingMovies = async () => {
  return movieRepository.getUpcomingMovies();
}

const updateMovie = async (
  movieId: string,
  updateMovieData: UpdateMovieDTO
) => {
  const existingMovie = await movieRepository.getMovieById(movieId);
  if (!existingMovie) throw new NoDataError("Movie not found");

  if (updateMovieData.posterUrl === "")
    updateMovieData.posterUrl = existingMovie.posterUrl || undefined;

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
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  getFeaturedMovies,
  getActiveMovies,
  getUpcomingMovies,
};
