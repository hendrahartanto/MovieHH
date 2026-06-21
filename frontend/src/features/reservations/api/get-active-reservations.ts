import { ApiResponse } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ActiveReservation } from "../types";

export type PaginatedActiveReservations = {
  activeReservations: ActiveReservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getActiveReservations = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<ApiResponse<PaginatedActiveReservations>> => {
  return api.get("/reservations/active", {
    params: { page, limit },
  });
};

export const getActiveReservationsQueryOptions = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  return queryOptions({
    queryKey: ["reservations", "active", { page, limit }],
    queryFn: () => getActiveReservations({ page, limit }),
  });
};

type UseActiveReservationsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getActiveReservationsQueryOptions>;
};

export const useActiveReservations = ({
  page,
  limit,
  queryConfig,
}: UseActiveReservationsOptions = {}) => {
  return useQuery({
    ...getActiveReservationsQueryOptions({ page, limit }),
    ...queryConfig,
  });
};
