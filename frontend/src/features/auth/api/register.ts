import { api } from "@/lib/api-client";
import { AuthResponse } from "@/lib/api";
import { RegisterInput } from "../types";

export const register = (data: RegisterInput): Promise<AuthResponse> => {
  return api.post("/auth/register", data);
};
