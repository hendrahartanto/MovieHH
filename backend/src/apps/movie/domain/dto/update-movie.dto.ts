import { z } from "zod";

export const updateMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  posterUrl: z.string().url("Invalid URL").nullable(),
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type UpdateMovieDTO = z.infer<typeof updateMovieSchema>;
