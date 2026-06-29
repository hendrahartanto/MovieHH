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

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.data.role)) {
    return <Navigate to={paths.home.getHref()} replace />;
  }

  return children;
};
