import { ApiResponse } from "@/lib/api";
import { Showtime } from "../types";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { queryOptions, useQuery } from "@tanstack/react-query";

export const getShowTimes = (
  search = ""
): Promise<ApiResponse<{ showTimes: Showtime[] }>> => {
  return api.get("/show-times", {
    params: { search },
  });
};

export const getShowTimesQueryOptions = ({
  search,
}: { search?: string } = {}) => {
  return queryOptions({
    queryKey: search ? ["show-times", { search }] : ["show-times"],
    queryFn: () => getShowTimes(search),
  });
};

type UseShowTimesOptions = {
  search?: string;
  queryConfig?: QueryConfig<typeof getShowTimesQueryOptions>;
};

export const useShowTimes = ({ search, queryConfig }: UseShowTimesOptions) => {
  return useQuery({
    ...getShowTimesQueryOptions({ search }),
    ...queryConfig,
  });
};
