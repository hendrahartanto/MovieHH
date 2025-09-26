import { ApiResponse, Movie } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getMoviesQueryOptions } from "./get-movies";

export const createMovieInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  poster: z
    .instanceof(File)
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file.type
        ),
      { message: "Only image files are allowed" }
    )
    .optional(),
  director: z.string().optional(),
  writer: z.string().optional(),
  duration: z
    .number({
      required_error: "Duration is required",
      invalid_type_error: "Duration must be a number",
    })
    .min(1, "Duration must be at least 1 minute"),
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type CreateMovieInput = z.infer<typeof createMovieInputSchema>;

export const createMovie = ({
  data,
}: {
  data: CreateMovieInput;
}): Promise<ApiResponse<{ movie: Movie }>> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description || "");
  formData.append("writer", data.writer || "");
  formData.append("director", data.director || "");
  formData.append("duration", String(data.duration));
  data.genreIds.forEach((id) => formData.append("genreIds", id));

  if (data.poster) {
    formData.append("poster", data.poster);
  }

  return api.post("/movies", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
