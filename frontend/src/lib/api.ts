import { ROLES } from "./authorization";

export type ApiResponse<T> = {
  message: string;
  data: T;
};

enum ReservationStatus {
  PENDING,
  CONFIRMED,
  CANCELED,
}

enum SeatStatus {
  AVAILABLE,
  RESERVED,
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
  description: string;
  posterUrl: string;
  genres: Genre[];
  showTimes: Showtime[];
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
  showTimes: Showtime[];
};

export type Seat = {
  id: string;
  seatNumber: string;
  seatRow: string;
  //theater
  //reservations
  //showTimes
};

export type Showtime = {
  id: string;
  movie: Movie;
  theater: Theater;
  startTime: Date;
  endTime: Date;
  //reservations
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
  seat: Seat;
  status: ReservationStatus;
  createAt: Date;
};

export type AuthResponse = ApiResponse<{
  token: string;
  user: User;
}>;
