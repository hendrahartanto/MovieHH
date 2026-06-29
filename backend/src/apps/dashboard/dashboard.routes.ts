import express from "express";
import dashboardController from "./entry-points/dashboard.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN));

router.get("/metrics", dashboardController.getMetrics);
router.get("/today-schedules", dashboardController.getTodaySchedules);
router.get("/recent-transactions", dashboardController.getRecentTransactions);
router.get("/recent-checkins", dashboardController.getRecentCheckIns);
router.get("/popular-movies", dashboardController.getPopularMovies);

export default router;
