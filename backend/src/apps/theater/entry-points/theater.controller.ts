import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createTheaterSchema } from "../domain/dto/create-theater.dto";
import theaterService from "../domain/theater.service";

const createTheater = asyncHandler(async (req, res) => {
  const validatedData = createTheaterSchema.parse(req.body);
  const newTheater = await theaterService.createTheater(validatedData);

  new SuccessResponse("Create theater successful", { newTheater }).send(res);
});

export default {
  createTheater,
};
