import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocationsQueryOptions } from "./get-locations";
import { ApiResponse } from "@/lib/api";
import { Location } from "../types";


export const deleteLocation = ({
  locationId,
}: {
  locationId: string;
}): Promise<ApiResponse<{ deletedLocation: Location }>> => {
  return api.delete(`/locations/${locationId}`);
};

type UseDeleteLocationOptions = {
  mutationConfig?: MutationConfig<typeof deleteLocation>;
};

export const useDeleteLocation = ({
  mutationConfig,
}: UseDeleteLocationOptions) => {
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
    mutationFn: deleteLocation,
  });
};
