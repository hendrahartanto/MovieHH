import { ApiResponse, Movie } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getMoviesQueryOptions } from "./get-movies";

export const updateMovieInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  posterUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type UpdateMovieInput = z.infer<typeof updateMovieInputSchema>;

export const updateMovie = ({
  data,
  movieId,
}: {
  data: UpdateMovieInput;
  movieId: string;
}): Promise<ApiResponse<{ updatedMovie: Movie }>> => {
  return api.put(`/movies/${movieId}`, data);
};

type UseUpdateMovieOptions = {
  mutationConfig?: MutationConfig<typeof updateMovie>;
};

export const useUpdateMovie = ({ mutationConfig }: UseUpdateMovieOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getMoviesQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateMovie,
  });
};
