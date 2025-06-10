import { z } from "zod";
import { api } from "./api-client";
import { setAccessToken } from "./token-store";
import { AuthResponse, User } from "./api";
import { configureAuth } from "react-query-auth";
import { Navigate, useLocation } from "react-router";
import { paths } from "@/config/paths";
import React from "react";

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

const getUser = async (): Promise<User> => {
  const res = await api.get("/auth/me");

  return res.data;
};

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

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const res = await login(data);
    setAccessToken(res.data.token);
    return res.data.user;
  },
  registerFn: async (data: RegisterInput) => {
    const res = await register(data);
    setAccessToken(res.data.token);
    return res.data.user;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
