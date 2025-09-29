import { z } from "zod";

export const getMovieScheduleByDateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export type GetMovieScheduleByDateDTO = z.infer<typeof getMovieScheduleByDateSchema>;
