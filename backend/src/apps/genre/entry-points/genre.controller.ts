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
  const genres = await genreService.getGenres();

  new SuccessResponse("Get Genres Successful", { genres }).send(res);
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
