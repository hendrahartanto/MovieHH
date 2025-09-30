import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createMovieScheduleSchema } from "../domain/dto/create-movie-schedule.dto";
import { createShowTimeSchema } from "../domain/dto/create-show-time.dto";
import { getMovieScheduleByDateRangeSchema } from "../domain/dto/get-movie-schedule-by-date-range.dto";
import { getShowTimesByDateRangeSchema } from "../domain/dto/get-show-times-by-date-range.dto";
import showTimeService from "../domain/show-time.service";

const createMovieSchedule = asyncHandler(async (req, res) => {
  const validatedData = createMovieScheduleSchema.parse(req.body);
  const newMovieSchedule = await showTimeService.createMovieSchedule(
    validatedData
  );

  new SuccessResponse("Create movie schedule successful", {
    newMovieSchedule,
  }).send(res);
});

const getMovieScheduleByDateRange = asyncHandler(async (req, res) => {
  const validatedData = getMovieScheduleByDateRangeSchema.parse(req.query);
  const movieSchedules = await showTimeService.getMovieScheduleByDateRange(
    validatedData
  );

  new SuccessResponse("Get movie schedules successful", movieSchedules).send(
    res
  );
});

const createShowTime = asyncHandler(async (req, res) => {
  const validatedData = createShowTimeSchema.parse(req.body);
  const newShowTime = await showTimeService.createShowTime(validatedData);

  new SuccessResponse("Create show time successful", { newShowTime }).send(res);
});

const getShowTimeByDateRange = asyncHandler(async (req, res) => {
  const validatedData = getShowTimesByDateRangeSchema.parse(req.query);
  const showTimes = await showTimeService.getShowTimeByDateRange(validatedData);

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
  createMovieSchedule,
  createShowTime,
  getMovieScheduleByDateRange,
  getShowTimeByDateRange,
  getShowTimeSeats,
};
