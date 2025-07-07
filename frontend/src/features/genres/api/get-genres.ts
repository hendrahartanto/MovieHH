import { ApiResponse, Genre, Pagination } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getGenres = ({
  page = 1,
  all = false,
}): Promise<ApiResponse<{ genres: Genre[]; pagination: Pagination }>> => {
  return api.get("/genres", {
    params: {
      page,
      all,
    },
  });
};

export const getGenreQueryOptions = ({
  page,
  all,
}: { page?: number; all?: boolean } = {}) => {
  return queryOptions({
    queryKey: page ? ["genres", { page }] : ["genres"],
    queryFn: () => getGenres({ page, all }),
  });
};

type UseGenresOptions = {
  page?: number;
  all?: boolean;
  queryConfig?: QueryConfig<typeof getGenreQueryOptions>;
};

export const useGenres = ({ page, all, queryConfig }: UseGenresOptions) => {
  return useQuery({ ...getGenreQueryOptions({ page, all }), ...queryConfig });
};
