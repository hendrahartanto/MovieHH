import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createShowTimeSchema } from "../domain/dto/create-show-time.dto";
import showTimeService from "../domain/show-time.service";

const createShowTime = asyncHandler(async (req, res) => {
  const validatedData = createShowTimeSchema.parse(req.body);
  const newShowTime = showTimeService.createShowTime(validatedData);

  new SuccessResponse("Create show time successful", newShowTime).send(res);
});

export default {
  createShowTime,
};
