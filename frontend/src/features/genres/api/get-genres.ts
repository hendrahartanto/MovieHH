import { ApiResponse, Pagination } from "@/lib/api";
import { Genre } from "../types";
import { api } from "@/lib/api-client";

import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getGenres = ({
  page = 1,
  all = false,
  search = "",
}): Promise<ApiResponse<{ genres: Genre[]; pagination: Pagination }>> => {
  return api.get("/genres", {
    params: {
      page,
      all,
      search,
    },
  });
};

export const getGenresQueryOptions = ({
  page,
  all,
  search,
}: { page?: number; all?: boolean; search?: string } = {}) => {
  return queryOptions({
    queryKey: page ? ["genres", { page, search }] : ["genres"],
    queryFn: () => getGenres({ page, all, search }),
  });
};

type UseGenresOptions = {
  page?: number;
  all?: boolean;
  search?: string;
  queryConfig?: QueryConfig<typeof getGenresQueryOptions>;
};

export const useGenres = ({
  page,
  all,
  search,
  queryConfig,
}: UseGenresOptions) => {
  return useQuery({
    ...getGenresQueryOptions({ page, all, search }),
    ...queryConfig,
  });
};
