import { ApiResponse } from "@/lib/api";
import { Theater } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getTheatersQueryOptions } from "./get-theaters";

export const layoutSchema = z.array(
  z.array(z.union([z.literal(0), z.literal(1)]))
);

export const createTheaterInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  locationId: z.string().uuid().min(1, "Location is required"),
  layout: layoutSchema.min(1, "Layout must have at least one row"),
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
