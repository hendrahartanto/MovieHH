import { z } from "zod";

export const getShowTimesByDateRangeSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export type GetShowTimesByDateRangeDTO = z.infer<
  typeof getShowTimesByDateRangeSchema
>;
