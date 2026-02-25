import { ApiResponse } from "@/lib/api";
import { Location } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getLocationsQueryOptions } from "./get-locations";

export const createLocationInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

export type CreateLocationInput = z.infer<typeof createLocationInputSchema>;

export const createLocation = ({
  data,
}: {
  data: CreateLocationInput;
}): Promise<ApiResponse<{ location: Location }>> => {
  return api.post("/locations", data);
};

type UseCreateLocationOptions = {
  mutationConfig?: MutationConfig<typeof createLocation>;
};

export const useCreateLocation = ({
  mutationConfig,
}: UseCreateLocationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getLocationsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createLocation,
  });
};
