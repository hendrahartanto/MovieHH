import { ApiResponse, Movie } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getMoviesQueryOptions } from "./get-movies";

export const createMovieInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  posterUrl: z.string().url("Invalid URL").nullable(),
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type CreateMovieInput = z.infer<typeof createMovieInputSchema>;

export const createMovie = ({
  data,
}: {
  data: CreateMovieInput;
}): Promise<ApiResponse<{ movie: Movie }>> => {
  return api.post("/movies", data);
};

type UseCreateMovieOptions = {
  mutationConfig?: MutationConfig<typeof createMovie>;
};

export const useCreateMovie = ({
  mutationConfig,
}: UseCreateMovieOptions = {}) => {
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
    mutationFn: createMovie,
  });
};
