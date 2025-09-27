import { z } from "zod";

export const createMovieScheduleSchema = z.object({
  movieId: z.string().uuid("Invalid movie id format"),
  theaterId: z.string().uuid("Invalid theater id format"),
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid startTime format",
    }),
  price: z.number(),
});

export type CreateMovieScheduleDTO = z.infer<typeof createMovieScheduleSchema>;
