import { ApiResponse, MovieSchedule, Pagination } from "@/lib/api";
import { api } from "@/lib/api-client";
import { queryConfig, QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getMovieSchedules = (
  page = 1,
  search = ""
): Promise<
  ApiResponse<{ movieSchedules: MovieSchedule[]; pagination: Pagination }>
> => {
  return api.get("show-times/movie-schedule", {
    params: {
      page,
      search,
    },
  });
};

export const getMovieSchedulesQueryOptions = ({
  page,
  search,
}: {
  page?: number;
  search?: string;
}) => {
  return queryOptions({
    queryKey: page
      ? ["movie-schedules", { page, search }]
      : ["movie-schedules"],
    queryFn: () => getMovieSchedules(page, search),
  });
};

type UseMovieSchedulesOptions = {
  page?: number;
  search?: string;
  queryConfig?: QueryConfig<typeof getMovieSchedulesQueryOptions>;
};

export const useMovieSchedules = ({
  page,
  search,
}: UseMovieSchedulesOptions) => {
  return useQuery({
    ...getMovieSchedulesQueryOptions({ page, search }),
    ...queryConfig,
  });
};
