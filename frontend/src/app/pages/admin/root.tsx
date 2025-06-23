import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { Outlet } from "react-router";

export const ErrorBoundary = () => {
  return <div>Something went wront!</div>;
};

export const AdminRoot = () => {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
};
