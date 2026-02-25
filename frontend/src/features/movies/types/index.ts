import { Genre } from "@/features/genres/types";
import { MovieSchedule } from "@/features/movie-schedules/types";

export enum MovieStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMING_SOON = "COMING_SOON",
}

export type Movie = {
  id: string;
  title: string;
  synopsis?: string;
  posterUrl?: string;
  bannerUrl?: string;
  duration: number;
  director?: string;
  writer?: string;
  isFeatured: boolean;
  status: MovieStatus;
  trailerUrl?: string;
  genres: Genre[];
  movieSchedules: MovieSchedule[];
  createdAt: Date;
  updatedAt: Date;
};
