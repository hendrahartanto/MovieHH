import { ApiResponse, Genre } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getGenresQueryOptions } from "./get-genres";

export const createGenreInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateGenreInput = z.infer<typeof createGenreInputSchema>;

export const createGenre = ({
  data,
}: {
  data: CreateGenreInput;
}): Promise<ApiResponse<{ genre: Genre }>> => {
  return api.post("/genres", data);
};

type UseCreateGenreOptions = {
  mutationConfig?: MutationConfig<typeof createGenre>;
};

export const useCreateGenre = ({
  mutationConfig,
}: UseCreateGenreOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getGenresQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createGenre,
  });
};
