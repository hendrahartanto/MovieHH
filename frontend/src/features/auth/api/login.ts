import { api } from "@/lib/api-client";
import { AuthResponse } from "@/lib/api";
import { LoginInput } from "../types";

export const login = (data: LoginInput): Promise<AuthResponse> => {
  return api.post("/auth/login", data);
};
