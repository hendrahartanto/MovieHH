import { z } from "zod";

export const createTheaterSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateTheaterDTO = z.infer<typeof createTheaterSchema>;
