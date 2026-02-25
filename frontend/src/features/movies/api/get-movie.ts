import { ApiResponse } from "@/lib/api";
import { Movie } from "../types";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";


export const getMovie = ({
  movieId,
}: {
  movieId: string;
}): Promise<ApiResponse<{ movie: Movie }>> => {
  return api.get(`/movies/${movieId}`);
};

export const getMovieQueryOption = ({ movieId }: { movieId: string }) => {
  return queryOptions({
    queryKey: ["movies", movieId],
    queryFn: () => getMovie({ movieId }),
  });
};

type UseMovieOptions = {
  movieId: string;
  queryConfig?: QueryConfig<typeof getMovieQueryOption>;
};

export const useMovie = ({ movieId, queryConfig }: UseMovieOptions) => {
  return useQuery({
    ...getMovieQueryOption({ movieId }),
    ...queryConfig,
  });
};
