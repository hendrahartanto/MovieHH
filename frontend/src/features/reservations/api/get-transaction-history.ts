import { ApiResponse } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ActiveReservation } from "../types";

export const getTransactionHistory = (): Promise<
  ApiResponse<{ transactionHistory: ActiveReservation[] }>
> => {
  return api.get("/reservations/history");
};

export const getTransactionHistoryQueryOptions = () => {
  return queryOptions({
    queryKey: ["reservations", "history"],
    queryFn: getTransactionHistory,
  });
};

type UseTransactionHistoryOptions = {
  queryConfig?: QueryConfig<typeof getTransactionHistoryQueryOptions>;
};

export const useTransactionHistory = ({
  queryConfig,
}: UseTransactionHistoryOptions = {}) => {
  return useQuery({
    ...getTransactionHistoryQueryOptions(),
    ...queryConfig,
  });
};
