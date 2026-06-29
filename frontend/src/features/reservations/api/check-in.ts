import { ApiResponse } from "@/lib/api";
import { Reservation } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const checkInReservation = (
  reservationId: string,
): Promise<ApiResponse<{ reservation: Reservation }>> => {
  return api.post(`/reservations/${reservationId}/check-in`);
};

type UseCheckInReservationOptions = {
  mutationConfig?: MutationConfig<typeof checkInReservation>;
};

export const useCheckInReservation = ({
  mutationConfig,
}: UseCheckInReservationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: checkInReservation,
  });
};
