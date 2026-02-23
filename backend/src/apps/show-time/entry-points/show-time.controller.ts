import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createMovieScheduleSchema } from "../domain/dto/create-movie-schedule.dto";
import { createShowTimeSchema } from "../domain/dto/create-show-time.dto";
import { getMovieScheduleByDateRangeSchema } from "../domain/dto/get-movie-schedule-by-date-range.dto";
import { getShowTimesByDateRangeSchema } from "../domain/dto/get-show-times-by-date-range.dto";
import { updateMovieScheduleSchema } from "../domain/dto/update-movie-schedule.dto";
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

const getMovieSchedules = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const { movieSchedules, total } =
    await showTimeService.getMovieSchedulesPaginated(page, limit, search);

  new SuccessResponse("Get movie schedules successful", {
    movieSchedules,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }).send(res);
});

const getMovieScheduleByDateRange = asyncHandler(async (req, res) => {
  const validatedData = getMovieScheduleByDateRangeSchema.parse(req.query);
  const movieSchedules = await showTimeService.getMovieScheduleByDateRange(
    validatedData
  );

  new SuccessResponse("Get movie schedules successful", { movieSchedules }).send(
    res
  );
});

const getMovieScheduleByMovieIdAndDateRange = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const validatedData = getMovieScheduleByDateRangeSchema.parse(req.query);

  const movieSchedules = await showTimeService.getMovieScheduleByMovieIdAndDateRange(
    movieId,
    validatedData
  );

  new SuccessResponse("Get movie schedules successful", { movieSchedules }).send(
    res
  );
});

const updateMovieSchedule = asyncHandler(async (req, res) => {
  const { movieScheduleId } = req.params;
  const validatedData = updateMovieScheduleSchema.parse(req.body);

  const updatedMovieSchedules = await showTimeService.updateMovieSchedule(
    movieScheduleId,
    validatedData
  );
  new SuccessResponse("Updtea movie schedule successful", {
    updatedMovieSchedules,
  }).send(res);
});

const deleteMovieSchedule = asyncHandler(async (req, res) => {
  const { movieScheduleId } = req.params;

  const deletedMovieSchedule = await showTimeService.deleteMovieSchedule(
    movieScheduleId
  );
  new SuccessResponse("Delete movie schedule successful", {
    deletedMovieSchedule,
  }).send(res);
});

const createShowTime = asyncHandler(async (req, res) => {
  const validatedData = createShowTimeSchema.parse(req.body);
  const newShowTime = await showTimeService.createShowTime(validatedData);

  new SuccessResponse("Create show time successful", { newShowTime }).send(res);
});

const getShowTimeByDateRange = asyncHandler(async (req, res) => {
  const validatedData = getShowTimesByDateRangeSchema.parse(req.query);
  const showTimes = await showTimeService.getShowTimeByDateRange(validatedData);

  new SuccessResponse("Get showtimes successful", { showTimes }).send(res);
});

const getShowTimeByMovieScheduleId = asyncHandler(async (req, res) => {
  const { movieScheduleId } = req.params;
  const showTimes = await showTimeService.getShowTimeByMovieScheduleId(
    movieScheduleId
  );

  new SuccessResponse("Get showtimes by movie id successful", {
    showTimes,
  }).send(res);
});

const getShowTimeSeats = asyncHandler(async (req, res) => {
  const showTimeId = req.params.showTimeId;
  const showTimeSeats = await showTimeService.getShowTimeSeats(showTimeId);

  new SuccessResponse("Get showtime seats successful", { showTimeSeats }).send(
    res
  );
});

const deleteShowTime = asyncHandler(async (req, res) => {
  const { showTimeId } = req.params;
  const deletedShowTime = await showTimeService.deleteShowTime(showTimeId);

  new SuccessResponse("Delete showtime successful", { deletedShowTime }).send(
    res
  );
});

export default {
  createMovieSchedule,
  createShowTime,
  getMovieScheduleByDateRange,
  getShowTimeByDateRange,
  getShowTimeSeats,
  getMovieSchedules,
  deleteMovieSchedule,
  updateMovieSchedule,
  getShowTimeByMovieScheduleId,
  deleteShowTime,
  getMovieScheduleByMovieIdAndDateRange
};
