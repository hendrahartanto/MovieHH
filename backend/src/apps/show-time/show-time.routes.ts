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
router.get("/", showTimeController.getShowTimeByDate);

export default router;
