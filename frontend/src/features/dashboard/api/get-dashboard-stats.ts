import { api } from "@/lib/api-client";
import { ApiResponse } from "@/lib/api";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type DashboardMetrics = {
  totalRevenue: number;
  totalTicketsSold: number;
  avgOccupancyRate: number;
  todayConfirmedTickets: number;
  todayCheckedInTickets: number;
};

export type DashboardSchedule = {
  id: string;
  startTime: string;
  endTime: string;
  movieTitle: string;
  theaterName: string;
  bookedSeats: number;
  totalSeats: number;
  occupancyPercent: number;
};

export type DashboardTransaction = {
  id: string;
  totalPrice: string | number;
  status: string;
  createAt: string;
  user: { name: string; email: string };
  showTime: {
    movieSchedule: {
      movie: { title: string };
    };
  };
};

export type DashboardCheckIn = {
  id: string;
  checkedInAt: string;
  user: { name: string };
  showTime: {
    movieSchedule: {
      movie: { title: string };
      theater: { name: string };
    };
  };
  reservationDetails: Array<{
    id: string;
    seat: { seatRow: string; seatNumber: string };
  }>;
};

export type DashboardPopularMovie = {
  title: string;
  posterUrl: string | null;
  ticketsSold: number;
  revenue: number;
};

export const getDashboardMetrics = (): Promise<ApiResponse<DashboardMetrics>> => {
  return api.get("/dashboard/metrics");
};

export const getDashboardMetricsQueryOptions = () => {
  return queryOptions({
    queryKey: ["dashboard-metrics"],
    queryFn: getDashboardMetrics,
  });
};

type UseDashboardMetricsOptions = {
  queryConfig?: QueryConfig<typeof getDashboardMetricsQueryOptions>;
};

export const useDashboardMetrics = ({ queryConfig }: UseDashboardMetricsOptions = {}) => {
  return useQuery({
    ...getDashboardMetricsQueryOptions(),
    ...queryConfig,
  });
};

export const getDashboardTodaySchedules = (): Promise<ApiResponse<DashboardSchedule[]>> => {
  return api.get("/dashboard/today-schedules");
};

export const getDashboardTodaySchedulesQueryOptions = () => {
  return queryOptions({
    queryKey: ["dashboard-today-schedules"],
    queryFn: getDashboardTodaySchedules,
  });
};

type UseDashboardTodaySchedulesOptions = {
  queryConfig?: QueryConfig<typeof getDashboardTodaySchedulesQueryOptions>;
};

export const useDashboardTodaySchedules = ({ queryConfig }: UseDashboardTodaySchedulesOptions = {}) => {
  return useQuery({
    ...getDashboardTodaySchedulesQueryOptions(),
    ...queryConfig,
  });
};

export const getDashboardRecentTransactions = (): Promise<ApiResponse<DashboardTransaction[]>> => {
  return api.get("/dashboard/recent-transactions");
};

export const getDashboardRecentTransactionsQueryOptions = () => {
  return queryOptions({
    queryKey: ["dashboard-recent-transactions"],
    queryFn: getDashboardRecentTransactions,
  });
};

type UseDashboardRecentTransactionsOptions = {
  queryConfig?: QueryConfig<typeof getDashboardRecentTransactionsQueryOptions>;
};

export const useDashboardRecentTransactions = ({ queryConfig }: UseDashboardRecentTransactionsOptions = {}) => {
  return useQuery({
    ...getDashboardRecentTransactionsQueryOptions(),
    ...queryConfig,
  });
};

export const getDashboardRecentCheckins = (): Promise<ApiResponse<DashboardCheckIn[]>> => {
  return api.get("/dashboard/recent-checkins");
};

export const getDashboardRecentCheckinsQueryOptions = () => {
  return queryOptions({
    queryKey: ["dashboard-recent-checkins"],
    queryFn: getDashboardRecentCheckins,
  });
};

type UseDashboardRecentCheckinsOptions = {
  queryConfig?: QueryConfig<typeof getDashboardRecentCheckinsQueryOptions>;
};

export const useDashboardRecentCheckins = ({ queryConfig }: UseDashboardRecentCheckinsOptions = {}) => {
  return useQuery({
    ...getDashboardRecentCheckinsQueryOptions(),
    ...queryConfig,
  });
};

export const getDashboardPopularMovies = (): Promise<ApiResponse<DashboardPopularMovie[]>> => {
  return api.get("/dashboard/popular-movies");
};

export const getDashboardPopularMoviesQueryOptions = () => {
  return queryOptions({
    queryKey: ["dashboard-popular-movies"],
    queryFn: getDashboardPopularMovies,
  });
};

type UseDashboardPopularMoviesOptions = {
  queryConfig?: QueryConfig<typeof getDashboardPopularMoviesQueryOptions>;
};

export const useDashboardPopularMovies = ({ queryConfig }: UseDashboardPopularMoviesOptions = {}) => {
  return useQuery({
    ...getDashboardPopularMoviesQueryOptions(),
    ...queryConfig,
  });
};
