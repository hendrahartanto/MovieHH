import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createMovieSchema } from "../domain/dto/create-movie.dto";
import { updateMovieSchema } from "../domain/dto/update-movie.dto";
import movieService from "../domain/movie.service";

const createMovie = asyncHandler(async (req, res) => {
  const posterFile = (req.files as any)?.poster?.[0];
  const bannerFile = (req.files as any)?.banner?.[0];

  let posterUrl = "";
  let bannerUrl = "";

  if (posterFile) posterUrl = `/uploads/${posterFile.filename}`;
  if (bannerFile) bannerUrl = `/uploads/${bannerFile.filename}`;

  let { genreIds, ...rest } = req.body;

  if (typeof genreIds === "string") genreIds = [genreIds];

  const validatedData = createMovieSchema.parse({
    ...rest,
    genreIds,
    posterUrl,
    bannerUrl,
  });

  const movie = await movieService.createMovie(validatedData);

  new SuccessResponse("Create movie successful", { movie }).send(res);
});

const getMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const { movies, total } = await movieService.getMovies(page, limit, search);

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
  const movie = await movieService.getMovie(movieId);

  new SuccessResponse("Get movie successful", { movie }).send(res);
});

const updateMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const posterFile = (req.files as any)?.poster?.[0];
  const bannerFile = (req.files as any)?.banner?.[0];

  let posterUrl = "";
  let bannerUrl = "";

  if (posterFile) posterUrl = `/uploads/${posterFile.filename}`;
  if (bannerFile) bannerUrl = `/uploads/${bannerFile.filename}`;

  let { genreIds, ...rest } = req.body;
  if (typeof genreIds === "string") genreIds = [genreIds];

  const validatedData = updateMovieSchema.parse({
    ...rest,
    genreIds,
    ...(posterUrl && { posterUrl }),
    ...(bannerUrl && { bannerUrl }),
  });

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
