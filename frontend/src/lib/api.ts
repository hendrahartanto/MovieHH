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

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  HOLD = "HOLD",
  RESERVED = "RESERVED",
}

export enum MovieStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMING_SOON = "COMING_SOON",
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

export type Movie = {
  id: string;
  title: string;
  synopsis?: string;
  posterUrl: string;
  duration: number;
  director?: string;
  writer?: string;
  isFeatured: boolean;
  status: MovieStatus;
  genres: Genre[];
  movieSchedules: MovieSchedule[];
  createdAt: Date;
  updatedAt: Date;
};

export type Genre = {
  id: string;
  name: string;
  movie: Movie[];
  createdAt: Date;
  updatedAt: Date;
};

export type Theater = {
  id: string;
  name: string;
  seats: Seat[];
  location: Location;
  movieSchedules: MovieSchedule[];
  createdAt: Date;
};

export type Seat = {
  id: string;
  seatNumber: string;
  seatRow: string;
  //theater
  //reservations
  //showTimes
};

export type MovieSchedule = {
  id: string;
  movie: Movie;
  theater: Theater;
  price: number;
  date: Date;
  showTimes: Showtime[];
  createdAt: Date;
  updatedAt: Date;
};

export type Showtime = {
  id: string;
  startTime: Date;
  endTime: Date;
  seats: Seat[];
  createdAt: Date;
  updatedAt: Date;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  theaters: Theater[];
  createdAt: Date;
};

export type SeatsOnShowtimes = {
  seat: Seat;
  showtime: Showtime;
  status: SeatStatus;
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
