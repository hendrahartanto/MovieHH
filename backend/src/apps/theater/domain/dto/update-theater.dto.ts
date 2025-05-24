import { z } from "zod";

export const updateTheaterSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type UpdateTheaterDTO = z.infer<typeof updateTheaterSchema>;
