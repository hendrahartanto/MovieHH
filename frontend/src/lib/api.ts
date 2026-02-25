import { Seat, Showtime } from "@/features/movie-schedules";
import { ROLES } from "./authorization";

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
