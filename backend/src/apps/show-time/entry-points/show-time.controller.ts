import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createShowTimeSchema } from "../domain/dto/create-show-time.dto";
import { getShowTimesByDateSchema } from "../domain/dto/get-show-times-by-date.dto";
import showTimeService from "../domain/show-time.service";

const createShowTime = asyncHandler(async (req, res) => {
  const validatedData = createShowTimeSchema.parse(req.body);
  const newShowTime = await showTimeService.createShowTime(validatedData);

  new SuccessResponse("Create show time successful", { newShowTime }).send(res);
});

const getShowTimeByDate = asyncHandler(async (req, res) => {
  const validatedData = getShowTimesByDateSchema.parse(req.query);
  const showTimes = await showTimeService.getShowTimeByDate(validatedData);

  new SuccessResponse("Get showtimes successful", showTimes).send(res);
});

const getShowTimeSeats = asyncHandler(async (req, res) => {
  const showTimeId = req.params.showTimeId;
  const showTimeSeats = await showTimeService.getShowTimeSeats(showTimeId);

  new SuccessResponse("Get showtime seats successful", { showTimeSeats }).send(
    res
  );
});

export default {
  createShowTime,
  getShowTimeByDate,
  getShowTimeSeats,
};
