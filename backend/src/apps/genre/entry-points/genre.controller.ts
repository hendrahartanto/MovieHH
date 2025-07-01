import {
  SuccessMsgResponse,
  SuccessResponse,
} from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createGenreSchema } from "../domain/dto/create-genre.dto";
import genreService from "../domain/genre.service";

const createGenre = asyncHandler(async (req, res) => {
  const validatedData = createGenreSchema.parse(req.body);
  await genreService.createGenre(validatedData);

  new SuccessMsgResponse("Genre Created Successfuly").send(res);
});

const getGenres = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { genres, total } = await genreService.getGenres(page, limit);

  new SuccessResponse("Get Genres Successful", {
    genres,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }).send(res);
});

const updateGenre = asyncHandler(async (req, res) => {
  const { genreId } = req.params;
  const validatedData = createGenreSchema.parse(req.body);

  const updatedGenre = await genreService.updateGenre(genreId, validatedData);
  new SuccessResponse("Update genre successful", updatedGenre).send(res);
});

const deleteGenre = asyncHandler(async (req, res) => {
  const { genreId } = req.params;

  const deletedGenre = await genreService.deleteGenre(genreId);
  new SuccessResponse("Delete genre successful", { deletedGenre }).send(res);
});

export default {
  createGenre,
  getGenres,
  updateGenre,
  deleteGenre,
};
