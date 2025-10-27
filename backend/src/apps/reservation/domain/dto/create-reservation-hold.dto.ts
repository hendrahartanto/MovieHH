import { z } from "zod";

export const createReservationHoldSchema = z.object({
  showTimeId: z.string().uuid("Invalid show time id format"),
  seatIds: z
    .array(z.string().uuid("Invalid seat id format"))
    .nonempty("At least one seat must be selected"),
  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"])
    .optional()
    .default("PENDING"),
  count: z.number().int().positive("Count must be greater than 0"),
});

export type CreateReservationHoldDTO = z.infer<
  typeof createReservationHoldSchema
>;
