import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { GenresList } from "@/features/genres/components/genres-list";
import { CreateGenre } from "../../../../features/genres/components/create-genre";
import { useSearchParams } from "react-router";
import { SearchBox } from "@/components/ui/search-box";

const GenresPage = () => {
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
      title="Genres"
      subtitle="Manage genres list"
      headerComponent={
        <div className="flex justify-between">
          <SearchBox
            onSearch={handleSearch}
            defaultValue={searchParams.get("search") || ""}
          />
          <CreateGenre />
        </div>
      }
    >
      <GenresList />
    </SidebarContentLayout>
  );
};

export default GenresPage;
