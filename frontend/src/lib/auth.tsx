import { configureAuth } from "react-query-auth";
import { Navigate, useLocation } from "react-router";
import { paths } from "@/config/paths";
import React from "react";
import { setAccessToken } from "./token-store";
import {
  getUser,
  login,
  register,
  logout,
  LoginInput,
  RegisterInput,
} from "@/features/auth";

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
