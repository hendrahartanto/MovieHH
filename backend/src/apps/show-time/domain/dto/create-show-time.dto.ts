import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createShowTimeSchema = z.object({
  movieScheduleId: z.string().uuid("Invalid movie schedule id format"),
  startTime: z
    .string()
    .regex(timeRegex, { message: "Invalid startTime format (use HH:mm)" }),
  endTime: z
    .string()
    .regex(timeRegex, { message: "Invalid endTime format (use HH:mm)" }),
});

export type CreateShowTimeDTO = z.infer<typeof createShowTimeSchema>;
