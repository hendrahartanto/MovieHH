import { z } from "zod";

export const getMovieScheduleByDateRangeSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export type GetMovieScheduleByDateRangeDTO = z.infer<
  typeof getMovieScheduleByDateRangeSchema
>;
