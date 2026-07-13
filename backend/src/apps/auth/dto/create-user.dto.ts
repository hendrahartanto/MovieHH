import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
