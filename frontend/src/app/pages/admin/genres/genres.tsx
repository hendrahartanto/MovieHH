import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { getGenreQueryOptions } from "@/features/genres/api/get-genres";
import { GenresList } from "@/features/genres/components/genres.list";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router";

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") || 1);

    const query = getGenreQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const GenresPage = () => {
  return (
    <SidebarContentLayout title="Genres">
      <div>This is genres page</div>
      <GenresList />
    </SidebarContentLayout>
  );
};

export default GenresPage;
