import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { SearchBox } from "@/components/ui/search-box";
import { CreateLocation } from "@/features/locations/components/create-location";
import { LocationsList } from "@/features/locations/components/locations-list";
import { useSearchParams } from "react-router";

const LocationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("search", value);
      params.set("page", "1");
      return params;
    });
  };

  return (
    <SidebarContentLayout title="Locations" subtitle="Manage locations list">
      <div className="flex justify-between">
        <SearchBox
          onSearch={handleSearch}
          defaultValue={searchParams.get("search") || ""}
        />
        <CreateLocation />
      </div>
      <div className="mt-4">
        <LocationsList />
      </div>
    </SidebarContentLayout>
  );
};

export default LocationsPage;
