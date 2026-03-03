import { ApiResponse } from "@/lib/api";
import { MovieSchedule, Showtime } from "../types";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { queryOptions, useQuery } from "@tanstack/react-query";

export type ShowtimeWithDetails = Showtime & { movieSchedule: MovieSchedule };

export const getShowTime = (
  showTimeId: string
): Promise<ApiResponse<{ showTime: ShowtimeWithDetails }>> => {
  return api.get(`/show-times/${showTimeId}`);
};

export const getShowTimeQueryOptions = (showTimeId: string) => {
  return queryOptions({
    queryKey: ["show-time", showTimeId],
    queryFn: () => getShowTime(showTimeId),
    enabled: !!showTimeId,
  });
};

type UseShowTimeOptions = {
  showTimeId: string;
  queryConfig?: QueryConfig<typeof getShowTimeQueryOptions>;
};

export const useShowTime = ({
  showTimeId,
  queryConfig,
}: UseShowTimeOptions) => {
  return useQuery({
    ...getShowTimeQueryOptions(showTimeId),
    ...queryConfig,
  });
};
