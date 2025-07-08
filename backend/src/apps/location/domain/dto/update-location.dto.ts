import { z } from "zod";

export const updateLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

export type UpdateLocationDTO = z.infer<typeof updateLocationSchema>;
