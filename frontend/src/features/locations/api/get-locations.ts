import { ApiResponse, Location, Pagination } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getLocations = ({
  page = 1,
  all = false,
}): Promise<ApiResponse<{ locations: Location[]; pagination: Pagination }>> => {
  return api.get("/locations", {
    params: {
      page,
      all,
    },
  });
};

export const getLocationsQueryOptions = ({
  page,
  all,
}: { page?: number; all?: boolean } = {}) => {
  return queryOptions({
    queryKey: page ? ["locations", { page }] : ["locations"],
    queryFn: () => getLocations({ page, all }),
  });
};

type UseLocationsOptions = {
  page?: number;
  all?: boolean;
  queryConfig?: QueryConfig<typeof getLocationsQueryOptions>;
};

export const useLocations = ({
  page,
  all,
  queryConfig,
}: UseLocationsOptions) => {
  return useQuery({
    ...getLocationsQueryOptions({ page, all }),
    ...queryConfig,
  });
};
