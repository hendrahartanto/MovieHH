import { ApiResponse, MovieSchedule } from "@/lib/api";
import { api } from "@/lib/api-client";
import { queryConfig, QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query"

export const getMovieSchedulesByMovieIdAndDate = (
  movieId: string,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<{ movieSchedules: MovieSchedule[] }>> => {
  return api.get(`show-times/${movieId}/movie-schedule`, {
    params: {
      startDate,
      endDate,
    }
  })
}

export const getMoviesScheduleByMovieIdAndDateOptions = ({
  movieId,
  startDate,
  endDate,
}: {
  movieId: string;
  startDate: string;
  endDate: string;
}) => {
  return queryOptions({
    queryKey: ["movie-schedules", { movieId, startDate, endDate }],
    queryFn: () => getMovieSchedulesByMovieIdAndDate(movieId, startDate, endDate),
  });
}

type UseMovieSchedulesByMovieIdAndDateOptions = {
  movieId: string
  startDate: string;
  endDate: string;
  queryConfig?: QueryConfig<typeof getMoviesScheduleByMovieIdAndDateOptions>;
};

export const useMovieSchedulesByMovieIdAndDate = ({ movieId, startDate, endDate }: UseMovieSchedulesByMovieIdAndDateOptions) => {
  return useQuery({
    ...getMoviesScheduleByMovieIdAndDateOptions({ movieId, startDate, endDate }),
    ...queryConfig,
  });
}
