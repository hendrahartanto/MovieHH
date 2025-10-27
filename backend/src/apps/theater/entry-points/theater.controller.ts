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

const getTheaters = asyncHandler(async (req, res) => {
  const all = req.query.all === "true";
  if (all) {
    const theaters = await theaterService.getTheaters();
    return new SuccessResponse("Get all theaters successful", {
      theaters,
    }).send(res);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const { theaters, total } = await theaterService.getTheatersPaginated(
    page,
    limit,
    search
  );

  new SuccessResponse("Get theaters successful", {
    theaters,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }).send(res);
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
  getTheaters,
};
