import { ApiResponse } from "@/lib/api";
import { Reservation } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getShowTimeQueryOptions } from "@/features/movie-schedules/api/get-show-time";

export const createReservationHoldSchema = z.object({
  showTimeId: z.string().uuid("Invalid show time id format"),
  seatIds: z
    .array(z.string().uuid("Invalid seat id format"))
    .min(1, "At least one seat must be selected"),
  count: z.number().int().positive("Count must be greater than 0"),
});

export type CreateReservationHoldInput = z.infer<
  typeof createReservationHoldSchema
>;

export const createReservationHold = (
  data: CreateReservationHoldInput,
): Promise<ApiResponse<{ newReservationHold: Reservation }>> => {
  return api.post("/reservations/hold", data);
};

type UseCreateReservationHoldOptions = {
  mutationConfig?: MutationConfig<typeof createReservationHold>;
};

export const useCreateReservationHold = ({
  mutationConfig,
}: UseCreateReservationHoldOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({
        queryKey: getShowTimeQueryOptions(variables.showTimeId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["show-time-seats", variables.showTimeId],
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createReservationHold,
  });
};
