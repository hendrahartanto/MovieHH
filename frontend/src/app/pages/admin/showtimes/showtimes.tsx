import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";

const ShowtimesPage = () => {
  return (
    <SidebarContentLayout
      title="Showtimes"
      subtitle="Manage your showtimes collection"
    >
      <div className="flex justify-end">{/* <CreateMovie /> */}</div>
      <div className="mt-4">{/* <MoviesList /> */}</div>
    </SidebarContentLayout>
  );
};

export default ShowtimesPage;
