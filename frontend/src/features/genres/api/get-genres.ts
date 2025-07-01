import { ApiResponse, Genre, Pagination } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getGenres = (
  page = 1
): Promise<ApiResponse<{ genres: Genre[]; pagination: Pagination }>> => {
  return api.get("/genres", {
    params: {
      page,
    },
  });
};

export const getGenreQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ["genres", { page }] : ["genres"],
    queryFn: () => getGenres(page),
  });
};

type UseGenresOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getGenreQueryOptions>;
};

export const useGenres = ({ page, queryConfig }: UseGenresOptions) => {
  return useQuery({ ...getGenreQueryOptions({ page }), ...queryConfig });
};
