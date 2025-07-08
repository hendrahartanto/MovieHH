import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createMovieSchema } from "../domain/dto/create-movie.dto";
import { updateMovieSchema } from "../domain/dto/update-movie.dto";
import movieService from "../domain/movie.service";

const createMovie = asyncHandler(async (req, res) => {
  const validatedData = createMovieSchema.parse(req.body);
  const movie = await movieService.createMovie(validatedData);

  new SuccessResponse("Create movie successful", { movie }).send(res);
});

const getMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { movies, total } = await movieService.getMovies(page, limit);

  new SuccessResponse("Get movies successful", {
    movies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }).send(res);
});

const getMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const movie = movieService.getMovie(movieId);
  new SuccessResponse("Get movie successful", { movie }).send(res);
});

const updateMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const validatedData = updateMovieSchema.parse(req.body);

  const updatedMovie = await movieService.updateMovie(movieId, validatedData);
  new SuccessResponse("Update movie successful", { updatedMovie }).send(res);
});

const deleteMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const deletedMovie = await movieService.deleteMovie(movieId);
  new SuccessResponse("Delete movie successful", { deletedMovie }).send(res);
});

export default {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovies,
  getMovie,
};
