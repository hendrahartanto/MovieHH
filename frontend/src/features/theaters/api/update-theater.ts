import { z } from "zod";
import { ApiResponse, Theater } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTheatersQueryOptions } from "./get-theaters";

export const updateTheaterInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  locationId: z.string().uuid("Invalid location ID"),
});

export type UpdateTheaterInput = z.infer<typeof updateTheaterInputSchema>;

export const updateTheater = ({
  data,
  theaterId,
}: {
  data: UpdateTheaterInput;
  theaterId: string;
}): Promise<ApiResponse<{ updatedTheater: Theater }>> => {
  return api.put(`/theaters/${theaterId}`, data);
};

type UseUpdateTheaterOptions = {
  mutationConfig?: MutationConfig<typeof updateTheater>;
};

export const useUpdateTheater = ({
  mutationConfig,
}: UseUpdateTheaterOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getTheatersQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateTheater,
  });
};
