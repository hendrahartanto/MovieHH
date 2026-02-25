import { ApiResponse } from "@/lib/api";
import { Movie } from "../types";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";


export const getFeaturedMovies = (): Promise<
  ApiResponse<{ featuredMovies: Movie[] }>
> => {
  return api.get("movies/featured");
};

export const getFeaturedMoviesQueryOptions = () => {
  return queryOptions({
    queryKey: ["featured_movies"],
    queryFn: () => getFeaturedMovies(),
  });
};

type UseFeaturedMovies = {
  queryConfig?: QueryConfig<typeof getFeaturedMoviesQueryOptions>;
};

export const useFeaturedMovies = ({ queryConfig }: UseFeaturedMovies) => {
  return useQuery({
    ...getFeaturedMoviesQueryOptions(),
    ...queryConfig,
  });
};
