import { ApiResponse } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ActiveReservationPayment } from "../types";

export const getActiveReservationPayment = (): Promise<
  ApiResponse<{ activePayment: ActiveReservationPayment | null }>
> => {
  return api.get("/reservations/active-payment");
};

export const getActiveReservationPaymentQueryOptions = () => {
  return queryOptions({
    queryKey: ["reservations", "active-payment"],
    queryFn: getActiveReservationPayment,
  });
};

type UseActiveReservationPaymentOptions = {
  queryConfig?: QueryConfig<typeof getActiveReservationPaymentQueryOptions>;
};

export const useActiveReservationPayment = ({
  queryConfig,
}: UseActiveReservationPaymentOptions = {}) => {
  return useQuery({
    ...getActiveReservationPaymentQueryOptions(),
    ...queryConfig,
  });
};
