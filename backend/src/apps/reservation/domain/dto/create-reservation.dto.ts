import { z } from "zod";

export const createReservationSchema = z.object({
  userId: z.string().uuid("Invalid user id format"),
  showTimeId: z.string().uuid("Invalid show time id format"),
  seatId: z.string().uuid("Invalid seat id format"),
  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELED"])
    .optional()
    .default("PENDING"),
});

export type CreateReservationDTO = z.infer<typeof createReservationSchema>;
