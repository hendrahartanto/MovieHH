import { z } from "zod";

export const createReservationSchema = z.object({
  userId: z.string().uuid("Invalid user id format"),
  showTimeId: z.string().uuid("Invalid show time id format"),
  seatIds: z
    .array(z.string().uuid("Invalid seat id format"))
    .nonempty("At least one seat must be selected"),
  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELED"])
    .optional()
    .default("PENDING"),
  count: z.number().int().positive("Count must be greater than 0"),
});

export type CreateReservationDTO = z.infer<typeof createReservationSchema>;

export type ReservationCreateInput = {
  userId: string;
  showTimeId: string;
  seatId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
};
