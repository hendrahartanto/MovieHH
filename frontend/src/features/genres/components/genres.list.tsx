import { useSearchParams } from "react-router";
import { useGenres } from "../api/get-genres";

export const GenresList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const genresQuery = useGenres({
    page: +(searchParams.get("page") || 1),
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  if (genresQuery.isLoading) {
    //TODO: genre table skeleton
  }

  const genres = genresQuery.data?.data.genres;
  const pagination = genresQuery.data?.data.pagination;

  console.log("GENRES LIST");
  console.log(genres);

  if (!genres || genres.length === 0) {
    //TOD: genre table empty state
  }

  return (
    <div>
      <div></div>
    </div>
  );
};
