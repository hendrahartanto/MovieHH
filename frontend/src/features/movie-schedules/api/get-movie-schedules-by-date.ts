import { ApiResponse } from "@/lib/api";
import { MovieSchedule } from "../types";
import { api } from "@/lib/api-client";
import { queryConfig, QueryConfig } from "@/lib/react-query";

import { queryOptions, useQuery } from "@tanstack/react-query";

export const getMovieSchedulesByDate = (
  startDate: string,
  endDate: string,
): Promise<ApiResponse<{ movieSchedules: MovieSchedule[] }>> => {
  return api.get("show-times/movie-schedule/date-range", {
    params: {
      startDate,
      endDate,
    },
  });
};

export const getMovieSchedulesByDateQueryOptions = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return queryOptions({
    queryKey: ["movie-schedules", { startDate, endDate }],
    queryFn: () => getMovieSchedulesByDate(startDate, endDate),
  });
};

type UseMovieSchedulesByDateOptions = {
  startDate: string;
  endDate: string;
  queryConfig?: QueryConfig<typeof getMovieSchedulesByDateQueryOptions>;
};

export const useMovieSchedulesByDate = ({
  startDate,
  endDate,
}: UseMovieSchedulesByDateOptions) => {
  return useQuery({
    ...getMovieSchedulesByDateQueryOptions({ startDate, endDate }),
    ...queryConfig,
  });
};
