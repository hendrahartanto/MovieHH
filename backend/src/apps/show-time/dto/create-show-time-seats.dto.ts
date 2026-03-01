import { z } from "zod";

export const createShowTimeSeatsSchema = z.object({
  showTimeId: z.string().uuid("Invalid showtime id format"),
  seatId: z.string().uuid("Invalid seat id format"),
});

export type CreateShowTimeSeatsDTO = z.infer<typeof createShowTimeSeatsSchema>;
