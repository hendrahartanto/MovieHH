import { z } from "zod";

export const createReservationPaymentSchema = z.object({
  reservationId: z.string().uuid("Invalid reservation id format"),
});

export type CreateReservationPaymentDTO = z.infer<
  typeof createReservationPaymentSchema
>;
