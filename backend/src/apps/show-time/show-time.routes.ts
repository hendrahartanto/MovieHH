import express from "express";
import showTimeController from "./entry-points/show-time.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.post(
  "/movie-schedule",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.createMovieSchedule,
);
router.delete(
  "/movie-schedule/:movieScheduleId",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.deleteMovieSchedule,
);
router.put(
  "/movie-schedule/:movieScheduleId",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.updateMovieSchedule,
);
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.createShowTime,
);
router.get(
  "/:showTimeId/seats",
  authenticate,
  showTimeController.getShowTimeSeats,
);
router.get(
  "/movie-schedule",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.getMovieSchedules,
);
router.delete(
  "/:showTimeId",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.deleteShowTime,
);
router.get("/movie-schedule", showTimeController.getMovieScheduleByDateRange);
router.get(
  "/movie-schedule/movie/:movieId",
  showTimeController.getMovieScheduleByMovieIdAndDateRange,
);
router.get(
  "/movie-schedule/theater/:theaterId",
  showTimeController.getMovieScheduleByTheaterIdAndDateRange,
);
router.get(
  "/:movieScheduleid/show-time",
  showTimeController.getShowTimeByMovieScheduleId,
);
router.get("/", showTimeController.getShowTimeByDateRange);

export default router;
