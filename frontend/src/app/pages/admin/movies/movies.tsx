import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { SearchBox } from "@/components/ui/search-box";
import { CreateMovie } from "@/features/movies/components/admin/create-movie";
import { MoviesList } from "@/features/movies/components/admin/movies-list";
import { useSearchParams } from "react-router";

const MoviesPage = () => {
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
      title="Movies"
      subtitle="Manage your movie collection"
      headerComponent={
        <div className="flex justify-between">
          <SearchBox
            onSearch={handleSearch}
            defaultValue={searchParams.get("search") || ""}
          />
          <CreateMovie />
        </div>
      }
    >
      <MoviesList />
    </SidebarContentLayout>
  );
};

export default MoviesPage;
