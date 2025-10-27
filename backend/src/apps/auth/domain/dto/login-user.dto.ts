import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginUserDTO = z.infer<typeof loginUserSchema>;
