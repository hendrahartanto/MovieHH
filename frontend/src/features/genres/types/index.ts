// Import with type to avoid runtime cycles if not needed, though mostly okay for interfaces/types.
import { Movie } from "@/features/movies/types";

export type Genre = {
  id: string;
  name: string;
  movie: Movie[];
  createdAt: Date;
  updatedAt: Date;
};
