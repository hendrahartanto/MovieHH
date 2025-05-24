import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createTheaterSchema } from "../domain/dto/create-theater.dto";
import theaterService from "../domain/theater.service";

const createTheater = asyncHandler(async (req, res) => {
  const validatedData = createTheaterSchema.parse(req.body);
  const newTheater = await theaterService.createTheater(validatedData);

  new SuccessResponse("Create theater successful", { newTheater }).send(res);
});

const updateTheater = asyncHandler(async (req, res) => {
  const { theaterId } = req.params;
  const validatedData = createTheaterSchema.parse(req.body);

  const updatedTheater = await theaterService.updateTheater(
    theaterId,
    validatedData
  );
  new SuccessResponse("Update theater successful", updatedTheater).send(res);
});

const deleteTheater = asyncHandler(async (req, res) => {
  const { theaterId } = req.params;

  const deletedTheater = await theaterService.deleteTheater(theaterId);
  new SuccessResponse("Delete theater successful", { deletedTheater }).send(
    res
  );
});

export default {
  createTheater,
  updateTheater,
  deleteTheater,
};
