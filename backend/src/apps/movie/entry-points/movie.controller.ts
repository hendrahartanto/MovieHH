import { SuccessMsgResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createMovieSchema } from "../domain/dto/create-movie.dto";
import movieService from "../domain/movie.service";

const createMovie = asyncHandler(async (req, res) => {
  const validatedData = createMovieSchema.parse(req.body);
  await movieService.createMovie(validatedData);

  new SuccessMsgResponse("Create Movie Successful").send(res);
});
