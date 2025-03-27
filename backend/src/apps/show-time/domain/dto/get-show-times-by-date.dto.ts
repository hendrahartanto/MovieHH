import { z } from "zod";

export const getShowTimesByDateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export type GetShowTimesByDateDTO = z.infer<typeof getShowTimesByDateSchema>;
