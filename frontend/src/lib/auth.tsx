import { z } from "zod";

export const inputLoginSchema = z.object({
  email: z.string().min(1, "Email is requried").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type InputLoginSchema = z.infer<typeof inputLoginSchema>;

export const inputRegisterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Role must be either regular or admin" }),
  }),
});

export type InputRegisterSchema = z.infer<typeof inputRegisterSchema>;
