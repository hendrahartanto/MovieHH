import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTheatersQueryOptions } from "./get-theaters";
import { ApiResponse, Theater } from "@/lib/api";

export const deleteTheater = ({
  theaterId,
}: {
  theaterId: string;
}): Promise<ApiResponse<{ deletedTheater: Theater }>> => {
  return api.delete(`/theaters/${theaterId}`);
};

type UseDeleteTheaterOptions = {
  mutationConfig?: MutationConfig<typeof deleteTheater>;
};

export const useDeleteTheater = ({
  mutationConfig,
}: UseDeleteTheaterOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTheatersQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteTheater,
  });
};
