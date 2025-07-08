import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { CreateTheater } from "@/features/theaters/components/create-theater";
import { TheatersList } from "@/features/theaters/components/theaters-list";

const TheatersPage = () => {
  return (
    <SidebarContentLayout title="Theaters" subtitle="Manage theaters list">
      <div className="flex justify-end">
        <CreateTheater />
      </div>
      <div className="mt-4">
        <TheatersList />
      </div>
    </SidebarContentLayout>
  );
};

export default TheatersPage;
