import { NavbarLayout } from "@/components/layouts/navbar-layout";
import { Outlet } from "react-router";

export const AppRoot = () => {
  return (
    <NavbarLayout>
      <Outlet />
    </NavbarLayout>
  );
};
