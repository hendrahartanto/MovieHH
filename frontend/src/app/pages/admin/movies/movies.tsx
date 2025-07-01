import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { getMoviesQueryOptions } from "@/features/movies/api/get-movies";
import { CreateMovie } from "@/features/movies/components/create-movie";
import { MoviesList } from "@/features/movies/components/movies-list";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router";

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") || 1);

    const query = getMoviesQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

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
