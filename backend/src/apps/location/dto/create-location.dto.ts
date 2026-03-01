import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

export type CreateLocationDTO = z.infer<typeof createLocationSchema>;
