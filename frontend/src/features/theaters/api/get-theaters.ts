import { ApiResponse, Pagination } from "@/lib/api";
import { Theater } from "../types";
import { api } from "@/lib/api-client";

import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getTheaters = ({
  page = 1,
  all = false,
  search = "",
}): Promise<ApiResponse<{ theaters: Theater[]; pagination: Pagination }>> => {
  return api.get("/theaters", {
    params: {
      page,
      all,
      search,
    },
  });
};

export const getTheatersQueryOptions = ({
  page,
  all,
  search,
}: { page?: number; all?: boolean; search?: string } = {}) => {
  return queryOptions({
    queryKey: page ? ["theaters", { page, search }] : ["theaters"],
    queryFn: () => getTheaters({ page, all, search }),
  });
};

type UseTheaterOptions = {
  page?: number;
  all?: boolean;
  search?: string;
  queryConfig?: QueryConfig<typeof getTheatersQueryOptions>;
};

export const useTheaters = ({
  page,
  all,
  search,
  queryConfig,
}: UseTheaterOptions) => {
  return useQuery({
    ...getTheatersQueryOptions({ page, all, search }),
    ...queryConfig,
  });
};
