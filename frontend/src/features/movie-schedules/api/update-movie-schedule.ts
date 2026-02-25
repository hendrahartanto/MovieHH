import { ApiResponse } from "@/lib/api";
import { MovieSchedule } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getMovieSchedulesQueryOptions } from "./get-movie-schedules";

export const updateMovieScheduleInputSchema = z.object({
  movieId: z.string().uuid("Invalid movie id format"),
  theaterId: z.string().uuid("Invalid theater id format"),
  date: z.string().min(1, "Date is required"),
  price: z.number().min(1, { message: "Minimal amount is 1" }),
});

export type UpdateMovieScheduleInput = z.infer<
  typeof updateMovieScheduleInputSchema
>;

export const updateMovieSchedule = ({
  data,
  movieScheduleId,
}: {
  data: UpdateMovieScheduleInput;
  movieScheduleId: string;
}): Promise<ApiResponse<{ updatedMovieSchedule: MovieSchedule }>> => {
  return api.put(`/show-times/movie-schedule/${movieScheduleId}`, data);
};

type UseUpdateMovieScheduleOptions = {
  mutationConfig?: MutationConfig<typeof updateMovieSchedule>;
};

export const useUpdateMovieSchedule = ({
  mutationConfig,
}: UseUpdateMovieScheduleOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getMovieSchedulesQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateMovieSchedule,
  });
};
