import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { CreateLocation } from "@/features/locations/components/create-location";
import { LocationsList } from "@/features/locations/components/locations-list";

const LocationsPage = () => {
  return (
    <SidebarContentLayout title="Locations" subtitle="Manage locations list">
      <div className="flex justify-end">
        <CreateLocation />
      </div>
      <div className="mt-4">
        <LocationsList />
      </div>
    </SidebarContentLayout>
  );
};

export default LocationsPage;
