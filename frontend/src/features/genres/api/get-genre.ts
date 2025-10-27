import { ApiResponse, Genre } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getGenre = ({
  genreId,
}: {
  genreId: string;
}): Promise<ApiResponse<{ genre: Genre }>> => {
  return api.get(`/genres/${genreId}`);
};

export const getGenreQueryOption = ({ genreId }: { genreId: string }) => {
  return queryOptions({
    queryKey: ["genres", genreId],
    queryFn: () => getGenre({ genreId }),
  });
};

type UseGenreOptions = {
  genreId: string;
  queryConfig?: QueryConfig<typeof getGenreQueryOption>;
};

export const useGenre = ({ genreId, queryConfig }: UseGenreOptions) => {
  return useQuery({
    ...getGenreQueryOption({ genreId }),
    ...queryConfig,
  });
};
