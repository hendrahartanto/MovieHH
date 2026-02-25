import { ApiResponse } from "@/lib/api";
import { Genre } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getGenresQueryOptions } from "./get-genres";
export const updateGenreInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type UpdateGenreInput = z.infer<typeof updateGenreInputSchema>;

export const updateGenre = ({
  data,
  genreId,
}: {
  data: UpdateGenreInput;
  genreId: string;
}): Promise<ApiResponse<{ updatedGenre: Genre }>> => {
  return api.put(`/genres/${genreId}`, data);
};

type UseUpdateGenreOptions = {
  mutationConfig?: MutationConfig<typeof updateGenre>;
};

export const useUpdateGenre = ({ mutationConfig }: UseUpdateGenreOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getGenresQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateGenre,
  });
};
