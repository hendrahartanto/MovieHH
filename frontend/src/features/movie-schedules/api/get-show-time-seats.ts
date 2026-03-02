import { ApiResponse } from "@/lib/api";
import { ShowtimeSeat } from "../types";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { queryOptions, useQuery } from "@tanstack/react-query";

export const getShowTimeSeats = (
  showTimeId: string
): Promise<ApiResponse<{ showTimeSeats: ShowtimeSeat[] }>> => {
  return api.get(`/show-times/${showTimeId}/seats`);
};

export const getShowTimeSeatsQueryOptions = (showTimeId: string) => {
  return queryOptions({
    queryKey: ["show-time-seats", showTimeId],
    queryFn: () => getShowTimeSeats(showTimeId),
    enabled: !!showTimeId,
  });
};

type UseShowTimeSeatsOptions = {
  showTimeId: string;
  queryConfig?: QueryConfig<typeof getShowTimeSeatsQueryOptions>;
};

export const useShowTimeSeats = ({
  showTimeId,
  queryConfig,
}: UseShowTimeSeatsOptions) => {
  return useQuery({
    ...getShowTimeSeatsQueryOptions(showTimeId),
    ...queryConfig,
  });
};
