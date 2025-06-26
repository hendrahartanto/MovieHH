import { Movie, Pagination } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getMovies = (
  page = 1
): Promise<{ movies: Movie[]; pagination: Pagination }> => {
  return api.get("/movies", {
    params: {
      page,
    },
  });
};

export const getMoviesQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ["movies", { page }] : ["movies"],
    queryFn: () => getMovies(page),
  });
};

type UseMoviesOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getMoviesQueryOptions>;
};

export const useMovies = ({ page, queryConfig }: UseMoviesOptions) => {
  return useQuery({ ...getMoviesQueryOptions({ page }), ...queryConfig }); //TODO: cari tau kegunaan spread operator disini
};
