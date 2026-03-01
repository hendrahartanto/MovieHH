import { z } from "zod";

export const createSeatSchema = z.object({
  theaterId: z.string().uuid("Invalid theater id format"),
  seatNumber: z.string().min(1, "Seat number is required"),
  seatRow: z.string().min(1, "Seat row is required"),
});

export type CreateSeatDTO = z.infer<typeof createSeatSchema>;
