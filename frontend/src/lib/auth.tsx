import { z } from "zod";
import { api } from "./api-client";
import { setAccessToken } from "./token-store";
import { AuthResponse } from "./api";

export const loginInputSchema = z.object({
  email: z.string().min(1, "Email is requried").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchmea = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Role must be either regular or admin" }),
  }),
});

export type RegisterInput = z.infer<typeof registerInputSchmea>;

const logout = (): Promise<void> => {
  setAccessToken(null);
  return api.post("/auth/logout");
};

const register = (data: RegisterInput): Promise<AuthResponse> => {
  return api.post("/auth/register", data);
};

const login = (data: LoginInput): Promise<AuthResponse> => {
  return api.post("auth/login", data);
};

const authConfig = {};
