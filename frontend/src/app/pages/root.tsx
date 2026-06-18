import { NavbarLayout } from "@/components/layouts/navbar-layout";
import { Outlet, ScrollRestoration } from "react-router";

const AppRoot = () => {
  return (
    <NavbarLayout>
      <Outlet />
      <ScrollRestoration />
    </NavbarLayout>
  );
};

export default AppRoot;
