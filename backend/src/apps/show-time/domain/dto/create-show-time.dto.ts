import { z } from "zod";

export const createShowTimeSchema = z.object({
  movieId: z.string().uuid("Invalid movie id format"),
  theaterId: z.string().uuid("Invalid theater id format"),
  startTime: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid startTime format",
    }),
  endTime: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid endTime format",
    }),
});

export type CreateShowTimeDTO = z.infer<typeof createShowTimeSchema>;
