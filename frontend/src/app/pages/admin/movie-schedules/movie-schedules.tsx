import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { SearchBox } from "@/components/ui/search-box";
import { CreateMovieSchedule } from "@/features/movie-schedules/components/admin/create-movie-schedule";
import { MovieSchedulesList } from "@/features/movie-schedules/components/admin/movie-schedules-list";
import { useSearchParams } from "react-router";

const MovieSchedulesPage = () => {
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
      title="Movie Schedules"
      subtitle="Manage your movie schedules"
      headerComponent={
        <div className="flex justify-between">
          <SearchBox
            onSearch={handleSearch}
            defaultValue={searchParams.get("search") || ""}
          />
          <CreateMovieSchedule />
        </div>
      }
    >
      <MovieSchedulesList />
    </SidebarContentLayout>
  );
};

export default MovieSchedulesPage;
