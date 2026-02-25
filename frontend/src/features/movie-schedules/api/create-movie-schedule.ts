import { ApiResponse } from "@/lib/api";
import { MovieSchedule } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getMovieSchedulesQueryOptions } from "./get-movie-schedules";

export const createMovieScheduleInputSchema = z.object({
  movieId: z.string().uuid("Invalid movie id format"),
  theaterId: z.string().uuid("Invalid theater id format"),
  date: z.string().min(1, "Date is required"),
  price: z.number().min(1, { message: "Minimal amount is 1" }),
});

export type CreateMovieScheduleInput = z.infer<
  typeof createMovieScheduleInputSchema
>;

export const createMovieSchedule = ({
  data,
}: {
  data: CreateMovieScheduleInput;
}): Promise<ApiResponse<{ newMovieSchedule: MovieSchedule }>> => {
  return api.post("/show-times/movie-schedule", data);
};

type UseCreateMovieScheduleOptions = {
  mutationConfig?: MutationConfig<typeof createMovieSchedule>;
};

export const useCreateMovieSchedule = ({
  mutationConfig,
}: UseCreateMovieScheduleOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMovieSchedulesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createMovieSchedule,
  });
};
