import { ApiResponse, Theater } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getTheatersQueryOptions } from "./get-theaters";

export const createTheaterInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  locationId: z.string().uuid().min(1, "Location is required"),
});

export type CreateTheaterInput = z.infer<typeof createTheaterInputSchema>;

export const createTheater = ({
  data,
}: {
  data: CreateTheaterInput;
}): Promise<ApiResponse<{ theater: Theater }>> => {
  return api.post("/theaters", data);
};

type UseCreateTheaterOptions = {
  mutationConfig?: MutationConfig<typeof createTheater>;
};

export const useCreateTheater = ({
  mutationConfig,
}: UseCreateTheaterOptions = {}) => {
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
    mutationFn: createTheater,
  });
};
