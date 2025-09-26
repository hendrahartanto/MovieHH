import { ApiResponse, Movie } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getMoviesQueryOptions } from "./get-movies";

export const updateMovieInputSchema = z.object({
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

export type UpdateMovieInput = z.infer<typeof updateMovieInputSchema>;

export const updateMovie = ({
  data,
  movieId,
}: {
  data: UpdateMovieInput;
  movieId: string;
}): Promise<ApiResponse<{ updatedMovie: Movie }>> => {
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

  return api.put(`/movies/${movieId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
