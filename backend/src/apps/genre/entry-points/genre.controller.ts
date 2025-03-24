import { SuccessMsgResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createGenreSchema } from "../domain/dto/create-genre.dto";
import genreService from "../domain/genre.service";

const createGenre = asyncHandler(async (req, res) => {
  const validatedData = createGenreSchema.parse(req.body);
  await genreService.createGenre(validatedData);

  new SuccessMsgResponse("Genre Created Successfuly").send(res);
});

export default {
  createGenre,
};
