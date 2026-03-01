import { z } from "zod";

export const createGenreSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateGenreDTO = z.infer<typeof createGenreSchema>;
