import { ApiResponse } from "@/lib/api";
import { Movie } from "../types";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";


export const getUpcomingMovies = (): Promise<
  ApiResponse<{ upcomingMovies: Movie[] }>
> => {
  return api.get("movies/upcoming");
};

export const getUpcomingMoviesQueryOptions = () => {
  return queryOptions({
    queryKey: ["upcoming_movies"],
    queryFn: () => getUpcomingMovies(),
  });
};

type UseUpcomingMovies = {
  queryConfig?: QueryConfig<typeof getUpcomingMoviesQueryOptions>;
};

export const useUpcomingMovies = ({ queryConfig }: UseUpcomingMovies) => {
  return useQuery({
    ...getUpcomingMoviesQueryOptions(),
    ...queryConfig,
  });
};
