import { ApiResponse } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ActiveReservation } from "../types";

export const getActiveReservations = (): Promise<
  ApiResponse<{ activeReservations: ActiveReservation[] }>
> => {
  return api.get("/reservations/active");
};

export const getActiveReservationsQueryOptions = () => {
  return queryOptions({
    queryKey: ["reservations", "active"],
    queryFn: getActiveReservations,
  });
};

type UseActiveReservationsOptions = {
  queryConfig?: QueryConfig<typeof getActiveReservationsQueryOptions>;
};

export const useActiveReservations = ({
  queryConfig,
}: UseActiveReservationsOptions = {}) => {
  return useQuery({
    ...getActiveReservationsQueryOptions(),
    ...queryConfig,
  });
};
