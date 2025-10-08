import { z } from "zod";
import { movieStatusEnum } from "./create-movie.dto";

export const updateMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  synopsis: z.string().optional(),
  posterUrl: z.string().optional(),
  duration: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Duration must be a positive number",
    }),
  director: z.string().optional(),
  writer: z.string().optional(),
  releaseDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  isFeatured: z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      return val === "true";
    })
    .default(false),
  status: movieStatusEnum,
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type UpdateMovieDTO = z.infer<typeof updateMovieSchema>;
