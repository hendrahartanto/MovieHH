import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";

const LocationsPage = () => {
  return (
    <SidebarContentLayout title="Locations" subtitle="Manage locations list">
      <div className="flex justify-end"></div>
      <div className="mt-4"></div>
    </SidebarContentLayout>
  );
};

export default LocationsPage;
