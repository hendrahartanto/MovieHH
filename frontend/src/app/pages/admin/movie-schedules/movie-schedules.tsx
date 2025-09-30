import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { CreateMovieSchedule } from "@/features/movie-schedules/components/create-movie-schedule";
import { MovieSchedulesList } from "@/features/movie-schedules/components/movie-schedules-list";

const MovieSchedulesPage = () => {
  return (
    <SidebarContentLayout
      title="Movie Schedules"
      subtitle="Manage your movie schedules"
    >
      <div className="flex justify-between">
        <CreateMovieSchedule />
      </div>
      <div className="mt-4">
        <MovieSchedulesList />
      </div>
    </SidebarContentLayout>
  );
};

export default MovieSchedulesPage;
