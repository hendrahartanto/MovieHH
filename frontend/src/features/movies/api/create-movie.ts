import { ApiResponse, Movie } from "@/lib/api";
import { api } from "@/lib/api-client";
import { z } from "zod";

export const createMovieInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  posterUrl: z.string().url("Invalid URL").nullable(),
  genreIds: z.array(z.string().uuid()).min(1, "At least one genre is required"),
});

export type CreateMovieInput = z.infer<typeof createMovieInputSchema>;

export const createMovie = ({
  data,
}: {
  data: CreateMovieInput;
}): Promise<ApiResponse<{ movie: Movie }>> => {
  return api.post("/movies", data);
};

//REFERENCE:
// export const createDiscussion = ({
//   data,
// }: {
//   data: CreateDiscussionInput;
// }): Promise<Discussion> => {
//   return api.post(`/discussions`, data);
// };

// type UseCreateDiscussionOptions = {
//   mutationConfig?: MutationConfig<typeof createDiscussion>;
// };

// export const useCreateDiscussion = ({
//   mutationConfig,
// }: UseCreateDiscussionOptions = {}) => {
//   const queryClient = useQueryClient();

//   const { onSuccess, ...restConfig } = mutationConfig || {};

//   return useMutation({
//     onSuccess: (...args) => {
//       queryClient.invalidateQueries({
//         queryKey: getDiscussionsQueryOptions().queryKey,
//       });
//       onSuccess?.(...args);
//     },
//     ...restConfig,
//     mutationFn: createDiscussion,
//   });
// };
