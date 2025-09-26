import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Duration must be a positive number",
    }),
  director: z.string().optional(),
  writer: z.string().optional(),
  posterUrl: z.string().optional(),
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type CreateMovieDTO = z.infer<typeof createMovieSchema>;
