import { ApiResponse } from "@/lib/api";
import { Location } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getLocationsQueryOptions } from "./get-locations";

export const updateLocationInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

export type UpdateLocationInput = z.infer<typeof updateLocationInputSchema>;

export const updateLocation = ({
  data,
  locationId,
}: {
  data: UpdateLocationInput;
  locationId: string;
}): Promise<ApiResponse<{ updatedLocation: Location }>> => {
  return api.put(`/locations/${locationId}`, data);
};

type UseUpdateLocationOptions = {
  mutationConfig?: MutationConfig<typeof updateLocation>;
};

export const useUpdateLocation = ({
  mutationConfig,
}: UseUpdateLocationOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getLocationsQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateLocation,
  });
};
