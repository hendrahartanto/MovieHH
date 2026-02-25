import { ApiResponse } from "@/lib/api";
import { MovieSchedule } from "../types";
import { api } from "@/lib/api-client";
import { queryConfig, QueryConfig } from "@/lib/react-query";

import { queryOptions, useQuery } from "@tanstack/react-query";

export const getMovieScheduleByTheaterIdAndDate = (
  theaterId: string,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<{ movieSchedules: MovieSchedule[] }>> => {
  return api.get(`show-times/movie-schedule/theater/${theaterId}`, {
    params: {
      startDate,
      endDate,
    },
  });
};

export const getMovieSchedulesByTheaterIdAndDateOptions = ({
  theaterId,
  startDate,
  endDate,
}: {
  theaterId: string;
  startDate: string;
  endDate: string;
}) => {
  return queryOptions({
    queryKey: ["movie-schedules", { theaterId, startDate, endDate }],
    queryFn: () =>
      getMovieScheduleByTheaterIdAndDate(theaterId, startDate, endDate),
  });
};

type UseMovieSchedulesByTheaterIdAndDateOptions = {
  theaterId: string;
  startDate: string;
  endDate: string;
  queryConfig?: QueryConfig<typeof getMovieScheduleByTheaterIdAndDate>;
};

export const useMovieSchedulesByTheaterIdAndDate = ({
  theaterId,
  startDate,
  endDate,
}: UseMovieSchedulesByTheaterIdAndDateOptions) => {
  return useQuery({
    ...getMovieSchedulesByTheaterIdAndDateOptions({
      theaterId,
      startDate,
      endDate,
    }),
    ...queryConfig,
  });
};
