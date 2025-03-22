import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  posterUrl: z.string(),
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type CreateMovieDTO = z.infer<typeof createMovieSchema>;
