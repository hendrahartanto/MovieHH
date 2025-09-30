import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";

const MovieSchedulesPage = () => {
  return (
    <SidebarContentLayout
      title="Movie Schedules"
      subtitle="Manage your movie schedules"
    >
      <div className="flex justify-between"></div>
      <div className="mt-4"></div>
    </SidebarContentLayout>
  );
};

export default MovieSchedulesPage;
