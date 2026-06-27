import React from "react";
import { useUser } from "./auth";

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type RoleTypes = keyof typeof ROLES;

export const useAuthorization = () => {
  const user = useUser();

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return allowedRoles.includes(user.data.role);
      }

      return true;
    },
    [user.data]
  );

  return { checkAccess, role: user.data?.role };
};

export interface AuthorizationProps {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
  allowedRoles: RoleTypes[];
}

export const Authorization = ({
  forbiddenFallback = null,
  children,
  allowedRoles,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();
  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
