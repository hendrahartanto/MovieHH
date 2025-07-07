import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { GenresList } from "@/features/genres/components/genres-list";

const GenresPage = () => {
  return (
    <SidebarContentLayout title="Genres" subtitle="Manage genres list">
      <GenresList />
    </SidebarContentLayout>
  );
};

export default GenresPage;
