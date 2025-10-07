import { ApiResponse, Showtime } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getShowTimesQueryOptions } from "./get-show-times-by-movie-schedule-id";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createShowTimeInputSchema = z.object({
  movieScheduleId: z.string().uuid("Invalid movie schedule id format"),
  startTime: z
    .string()
    .regex(timeRegex, { message: "Invalid startTime format (use HH:mm)" }),
  endTime: z
    .string()
    .regex(timeRegex, { message: "Invalid endTime format (use HH:mm)" }),
});

export type CreateShowTimeInput = z.infer<typeof createShowTimeInputSchema>;

export const createShowTime = ({
  data,
}: {
  data: CreateShowTimeInput;
}): Promise<ApiResponse<{ newShowTime: Showtime }>> => {
  return api.post("/show-times", data);
};

type UseCreateShowTimeOptions = {
  mutationConfig?: MutationConfig<typeof createShowTime>;
};

export const useCreateShowTime = ({
  mutationConfig,
}: UseCreateShowTimeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getShowTimesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createShowTime,
  });
};
