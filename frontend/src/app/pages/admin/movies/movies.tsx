import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { CreateMovie } from "@/features/movies/components/create-movie";
import { MoviesList } from "@/features/movies/components/movies-list";

const MoviesPage = () => {
  return (
    <SidebarContentLayout
      title="Movies"
      subtitle="Manage your movie collection"
    >
      <div className="flex justify-end">
        <CreateMovie />
      </div>
      <div className="mt-4">
        <MoviesList />
      </div>
    </SidebarContentLayout>
  );
};

export default MoviesPage;
