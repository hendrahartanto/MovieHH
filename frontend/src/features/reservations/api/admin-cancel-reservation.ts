import { ApiResponse } from "@/lib/api";
import { Reservation } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const adminCancelReservation = (
  reservationId: string,
): Promise<ApiResponse<{ cancelledReservation: Reservation }>> => {
  return api.post(`/reservations/admin/${reservationId}/cancel`);
};

type UseAdminCancelReservationOptions = {
  mutationConfig?: MutationConfig<typeof adminCancelReservation>;
};

export const useAdminCancelReservation = ({
  mutationConfig,
}: UseAdminCancelReservationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-reservations"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: adminCancelReservation,
  });
};
