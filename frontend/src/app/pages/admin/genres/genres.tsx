import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { GenresList } from "@/features/genres/components/genres-list";
import { CreateGenre } from "./create-genre";

const GenresPage = () => {
  return (
    <SidebarContentLayout title="Genres" subtitle="Manage genres list">
      <div className="flex justify-end">
        <CreateGenre />
      </div>
      <div className="mt-4">
        <GenresList />
      </div>
    </SidebarContentLayout>
  );
};

export default GenresPage;
