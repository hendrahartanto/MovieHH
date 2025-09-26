import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration: z
    .number({
      required_error: "Duration is required",
      invalid_type_error: "Duration must be a number",
    })
    .min(1, "Duration must be at least 1 minute"),
  director: z.string().optional(),
  writer: z.string().optional(),
  posterUrl: z.string().optional(),
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type CreateMovieDTO = z.infer<typeof createMovieSchema>;
