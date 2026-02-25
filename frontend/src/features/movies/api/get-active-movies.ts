import { ApiResponse } from "@/lib/api";
import { Movie } from "../types";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";


export const getActiveMovies = (): Promise<
  ApiResponse<{ activeMovies: Movie[] }>
> => {
  return api.get("movies/active");
};

export const getActiveMoviesQueryOptions = () => {
  return queryOptions({
    queryKey: ["active_movies"],
    queryFn: () => getActiveMovies(),
  });
};

type UseActiveMovies = {
  queryConfig?: QueryConfig<typeof getActiveMoviesQueryOptions>;
};

export const useActiveMovies = ({ queryConfig }: UseActiveMovies) => {
  return useQuery({
    ...getActiveMoviesQueryOptions(),
    ...queryConfig,
  });
};
