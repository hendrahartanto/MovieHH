import { ApiResponse, Movie, Pagination } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getMovies = (
  page = 1,
  search = ""
): Promise<ApiResponse<{ movies: Movie[]; pagination: Pagination }>> => {
  return api.get("/movies", {
    params: {
      page,
      search,
    },
  });
};

export const getMoviesQueryOptions = ({
  page,
  search,
}: { page?: number; search?: string } = {}) => {
  return queryOptions({
    queryKey: page ? ["movies", { page, search }] : ["movies"],
    queryFn: () => getMovies(page, search),
  });
};

type UseMoviesOptions = {
  page?: number;
  search?: string;
  queryConfig?: QueryConfig<typeof getMoviesQueryOptions>;
};

export const useMovies = ({ page, search, queryConfig }: UseMoviesOptions) => {
  return useQuery({
    ...getMoviesQueryOptions({ page, search }),
    ...queryConfig,
  }); //TODO: cari tau kegunaan spread operator disini
};
