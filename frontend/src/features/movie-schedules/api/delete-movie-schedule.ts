import { ApiResponse } from "@/lib/api";
import { MovieSchedule } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMovieSchedulesQueryOptions } from "./get-movie-schedules";

export const deleteMovieSchedule = ({
  movieScheduleId,
}: {
  movieScheduleId: string;
}): Promise<ApiResponse<{ deletedMovieSchedule: MovieSchedule }>> => {
  return api.delete(`/show-times/movie-schedule/${movieScheduleId}`);
};

type UseDeleteMovieScheduleOptions = {
  mutationConfig?: MutationConfig<typeof deleteMovieSchedule>;
};

export const useDeleteMovieSchedule = ({
  mutationConfig,
}: UseDeleteMovieScheduleOptions) => {
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
    mutationFn: deleteMovieSchedule,
  });
};
