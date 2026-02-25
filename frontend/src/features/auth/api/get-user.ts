import { api } from "@/lib/api-client";
import { User } from "@/lib/api";

export const getUser = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return res.data;
};
