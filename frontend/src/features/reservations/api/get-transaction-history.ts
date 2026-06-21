import { ApiResponse } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ActiveReservation } from "../types";

export type PaginatedTransactionHistory = {
  transactionHistory: ActiveReservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getTransactionHistory = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<ApiResponse<PaginatedTransactionHistory>> => {
  return api.get("/reservations/history", {
    params: { page, limit },
  });
};

export const getTransactionHistoryQueryOptions = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  return queryOptions({
    queryKey: ["reservations", "history", { page, limit }],
    queryFn: () => getTransactionHistory({ page, limit }),
  });
};

type UseTransactionHistoryOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getTransactionHistoryQueryOptions>;
};

export const useTransactionHistory = ({
  page,
  limit,
  queryConfig,
}: UseTransactionHistoryOptions = {}) => {
  return useQuery({
    ...getTransactionHistoryQueryOptions({ page, limit }),
    ...queryConfig,
  });
};
