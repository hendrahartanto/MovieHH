import { z } from "zod";

export const cancelReservationSchema = z.object({
  reservationId: z.string().uuid("Invalid reservation id format"),
});

export type CancelReservationDTO = z.infer<typeof cancelReservationSchema>;
