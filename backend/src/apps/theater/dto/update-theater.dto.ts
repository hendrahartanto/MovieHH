import { z } from "zod";
import { layoutSchema } from "./create-theater.dto";

export const updateTheaterSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  layout: layoutSchema.optional(),
});

export type UpdateTheaterDTO = z.infer<typeof updateTheaterSchema>;

