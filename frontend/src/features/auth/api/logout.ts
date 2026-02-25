import { api } from "@/lib/api-client";
import { setAccessToken } from "@/lib/token-store";

export const logout = (): Promise<void> => {
  setAccessToken(null);
  return api.post("/auth/logout");
};
