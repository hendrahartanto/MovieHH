import { NavbarLayout } from "@/components/layouts/navbar-layout";
import { Outlet, ScrollRestoration } from "react-router";

export const AppRoot = () => {
  return (
    <NavbarLayout>
      <Outlet />
      <ScrollRestoration />
    </NavbarLayout>
  );
};
