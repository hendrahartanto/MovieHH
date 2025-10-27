import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { SearchBox } from "@/components/ui/search-box";
import { CreateTheater } from "@/features/theaters/components/create-theater";
import { TheatersList } from "@/features/theaters/components/theaters-list";
import { useSearchParams } from "react-router";

const TheatersPage = () => {
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
    <SidebarContentLayout
      title="Theaters"
      subtitle="Manage theaters list"
      headerComponent={
        <div className="flex justify-between">
          <SearchBox
            onSearch={handleSearch}
            defaultValue={searchParams.get("search") || ""}
          />
          <CreateTheater />
        </div>
      }
    >
      <TheatersList />
    </SidebarContentLayout>
  );
};

export default TheatersPage;
