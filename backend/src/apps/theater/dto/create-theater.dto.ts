import { z } from "zod";

export const layoutSchema = z.array(
  z.array(z.union([z.literal(0), z.literal(1)]))
);

export const createTheaterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  locationId: z.string().uuid().min(1, "Location is required"),
  layout: layoutSchema,
});

export type CreateTheaterDTO = z.infer<typeof createTheaterSchema>;
