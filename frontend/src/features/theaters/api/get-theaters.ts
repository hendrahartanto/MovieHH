import { ApiResponse, Pagination, Theater } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getTheaters = ({
  page = 1,
  all = false,
}): Promise<ApiResponse<{ theaters: Theater[]; pagination: Pagination }>> => {
  return api.get("/theaters", {
    params: {
      page,
      all,
    },
  });
};

export const getTheatersQueryOptions = ({
  page,
  all,
}: { page?: number; all?: boolean } = {}) => {
  return queryOptions({
    queryKey: page ? ["theaters", { page }] : ["theaters"],
    queryFn: () => getTheaters({ page, all }),
  });
};

type UseTheaterOptions = {
  page?: number;
  all?: boolean;
  queryConfig?: QueryConfig<typeof getTheatersQueryOptions>;
};

export const useTheaters = ({ page, all, queryConfig }: UseTheaterOptions) => {
  return useQuery({
    ...getTheatersQueryOptions({ page, all }),
    ...queryConfig,
  });
};
