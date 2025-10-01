import express from "express";
import showTimeController from "./entry-points/show-time.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.post(
  "/movie-schedule",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.createMovieSchedule
);
router.delete(
  "/movie-schedule/:movieScheduleId",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.deleteMovieSchedule
);
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.createShowTime
);
router.get(
  "/:showTimeId/seats",
  authenticate,
  showTimeController.getShowTimeSeats
);
router.get(
  "/movie-schedule",
  authenticate,
  authorize(Role.ADMIN),
  showTimeController.getMovieSchedules
);
router.get("/movie-schedule", showTimeController.getMovieScheduleByDateRange);
router.get("/", showTimeController.getShowTimeByDateRange);

export default router;
