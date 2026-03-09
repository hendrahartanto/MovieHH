import { ApiResponse } from "@/lib/api";
import { Reservation } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getShowTimeQueryOptions } from "@/features/movie-schedules/api/get-show-time";

export const cancelReservationSchema = z.object({
  reservationId: z.string().uuid("Invalid reservation id format"),
});

export type CancelReservationInput = z.infer<typeof cancelReservationSchema>;

export const cancelReservation = (
  data: CancelReservationInput,
): Promise<ApiResponse<{ cancelledReservation: Reservation }>> => {
  return api.post("/reservations/cancel", data);
};

type UseCancelReservationOptions = {
  mutationConfig?: MutationConfig<typeof cancelReservation>;
};

export const useCancelReservation = ({
  mutationConfig,
}: UseCancelReservationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      const [response] = args;
      const showTimeId = response.data?.cancelledReservation?.showTimeId;
      if (showTimeId) {
        queryClient.invalidateQueries({
          queryKey: getShowTimeQueryOptions(showTimeId).queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: ["show-time-seats", showTimeId],
        });
      }

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: cancelReservation,
  });
};
