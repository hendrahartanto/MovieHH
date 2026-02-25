import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/api";
import { Showtime } from "../types";
import { getMovieSchedulesQueryOptions } from "./get-movie-schedules";


export const deleteShowTime = ({
  showTimeId,
}: {
  showTimeId: string;
}): Promise<ApiResponse<{ deletedShowTime: Showtime }>> => {
  return api.delete(`/show-times/${showTimeId}`);
};

type UseDeleteShowTimeOptions = {
  mutationConfig?: MutationConfig<typeof deleteShowTime>;
};

export const useDeleteShowTime = ({
  mutationConfig,
}: UseDeleteShowTimeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteShowTime,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMovieSchedulesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
