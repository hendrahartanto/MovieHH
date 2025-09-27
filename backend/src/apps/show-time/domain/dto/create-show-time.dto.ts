import { z } from "zod";

export const createShowTimeSchema = z.object({
  movieScheduleId: z.string().uuid("Invalid movie schedule id format"),
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
