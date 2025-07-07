import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMoviesQueryOptions } from "./get-movies";

export const deleteMovie = ({ movieId }: { movieId: string }) => {
  return api.delete(`/movies/${movieId}`);
};

type UseDeleteMovieOptions = {
  mutationConfig?: MutationConfig<typeof deleteMovie>;
};

export const useDeleteMovie = ({ mutationConfig }: UseDeleteMovieOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMoviesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteMovie,
  });
};
