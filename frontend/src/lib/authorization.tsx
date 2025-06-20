import React from "react";
import { useUser } from "./auth";

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

type RoleTypes = keyof typeof ROLES;

export const useAuthorization = () => {
  const user = useUser();

  const checkAccess = React.useCallbackk(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {}
  );
};
