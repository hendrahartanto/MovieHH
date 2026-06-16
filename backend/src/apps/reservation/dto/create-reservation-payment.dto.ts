import { z } from "zod";

export const createReservationPaymentSchema = z.object({
  reservationId: z.string().uuid("Invalid reservation id format"),
  returnUrl: z.string().url("Invalid return url format").optional(),
});

export type CreateReservationPaymentDTO = z.infer<
  typeof createReservationPaymentSchema
>;
