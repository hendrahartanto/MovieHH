import { ApiResponse, Pagination } from "@/lib/api";
import { Location } from "../types";
import { api } from "@/lib/api-client";

import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getLocations = ({
  page = 1,
  all = false,
  search = "",
}): Promise<ApiResponse<{ locations: Location[]; pagination: Pagination }>> => {
  return api.get("/locations", {
    params: {
      page,
      all,
      search,
    },
  });
};

export const getLocationsQueryOptions = ({
  page,
  all,
  search,
}: { page?: number; all?: boolean; search?: string } = {}) => {
  return queryOptions({
    queryKey: page ? ["locations", { page, search }] : ["locations"],
    queryFn: () => getLocations({ page, all, search }),
  });
};

type UseLocationsOptions = {
  page?: number;
  all?: boolean;
  search?: string;
  queryConfig?: QueryConfig<typeof getLocationsQueryOptions>;
};

export const useLocations = ({
  page,
  all,
  search,
  queryConfig,
}: UseLocationsOptions) => {
  return useQuery({
    ...getLocationsQueryOptions({ page, all, search }),
    ...queryConfig,
  });
};
