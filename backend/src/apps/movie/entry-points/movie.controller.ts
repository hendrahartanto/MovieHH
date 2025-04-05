import {
  SuccessMsgResponse,
  SuccessResponse,
} from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createMovieSchema } from "../domain/dto/create-movie.dto";
import movieService from "../domain/movie.service";

const createMovie = asyncHandler(async (req, res) => {
  const validatedData = createMovieSchema.parse(req.body);
  await movieService.createMovie(validatedData);

  new SuccessMsgResponse("Create movie successful").send(res);
});

const getMovies = asyncHandler(async (req, res) => {
  const movies = await movieService.getMovies();

  new SuccessResponse("Get movies successful", { movies }).send(res);
});

const updateMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const validatedData = createMovieSchema.parse(req.body);

  const updatedMovie = await movieService.updateMovie(movieId, validatedData);
  new SuccessResponse("Update movie successful", updatedMovie).send(res);
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
};
