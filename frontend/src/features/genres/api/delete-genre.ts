import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getGenresQueryOptions } from "./get-genres";
import { ApiResponse, Genre } from "@/lib/api";

export const deleteGenre = ({
  genreId,
}: {
  genreId: string;
}): Promise<ApiResponse<{ deletedGenre: Genre }>> => {
  return api.delete(`/genres/${genreId}`);
};

type UseDeleteGenreOptions = {
  mutationConfig?: MutationConfig<typeof deleteGenre>;
};

export const useDeleteGenre = ({ mutationConfig }: UseDeleteGenreOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getGenresQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteGenre,
  });
};
