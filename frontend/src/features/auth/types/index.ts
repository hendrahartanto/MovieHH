import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Role must be either regular or admin" }),
  }),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
