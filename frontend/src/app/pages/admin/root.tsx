import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { Outlet } from "react-router";

export const ErrorBoundary = () => {
  return <div>Something went wront!</div>;
};

const AdminRoot = () => {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
};

export default AdminRoot;
