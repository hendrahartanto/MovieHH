import { ROLES } from "./authorization";
import type { Showtime } from "@/features/movie-schedules/types";
import type { Seat } from "@/features/theaters/types";

// Re-export types for backward compatibility
export type { Genre } from "@/features/genres/types";
export type { Movie } from "@/features/movies/types";
export { MovieStatus } from "@/features/movies/types";
export type {
  MovieSchedule,
  Showtime,
  SeatsOnShowtimes,
} from "@/features/movie-schedules/types";
export type { Location } from "@/features/locations/types";
export type { Seat, Theater } from "@/features/theaters/types";
export { SeatStatus } from "@/features/theaters/types";

export type ApiResponse<T> = {
  message: string;
  data: T;
};

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: ROLES;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Reservation = {
  id: string;
  user: User;
  showTime: Showtime;
  status: ReservationStatus;
  totalPrice: number;
  expiresAt: Date;
  createAt: Date;
  reservationDetails: ReservationDetail[];
};

export type ReservationDetail = {
  id: string;
  reservation: Reservation;
  seat: Seat;
};

export type AuthResponse = ApiResponse<{
  token: string;
  user: User;
}>;

