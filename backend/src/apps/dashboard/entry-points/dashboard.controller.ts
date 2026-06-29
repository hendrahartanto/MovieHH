import { SuccessResponse } from "../../../lib/http/api-response";
import asyncHandler from "../../../lib/utils/async.util";
import { ProtectedRequest } from "../../../types/app-requests";
import dashboardService from "../domain/dashboard.service";

const getMetrics = asyncHandler<ProtectedRequest>(async (req, res) => {
  const metrics = await dashboardService.getMetrics();
  new SuccessResponse("Fetch dashboard metrics successful", metrics).send(res);
});

const getTodaySchedules = asyncHandler<ProtectedRequest>(async (req, res) => {
  const schedules = await dashboardService.getTodaySchedules();
  new SuccessResponse("Fetch today schedules successful", schedules).send(res);
});

const getRecentTransactions = asyncHandler<ProtectedRequest>(async (req, res) => {
  const transactions = await dashboardService.getRecentTransactions();
  new SuccessResponse("Fetch recent transactions successful", transactions).send(res);
});

const getRecentCheckIns = asyncHandler<ProtectedRequest>(async (req, res) => {
  const checkins = await dashboardService.getRecentCheckIns();
  new SuccessResponse("Fetch recent checkins successful", checkins).send(res);
});

const getPopularMovies = asyncHandler<ProtectedRequest>(async (req, res) => {
  const popular = await dashboardService.getPopularMovies();
  new SuccessResponse("Fetch popular movies successful", popular).send(res);
});

export default {
  getMetrics,
  getTodaySchedules,
  getRecentTransactions,
  getRecentCheckIns,
  getPopularMovies,
};
