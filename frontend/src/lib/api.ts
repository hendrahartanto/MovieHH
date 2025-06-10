export type ApiResponse<T> = {
  message: string;
  data: T;
};

enum Role {
  USER,
  ADMIN,
}

enum ReservationStatus {
  PENDING,
  CONFIRMED,
  CANCELED,
}

enum SeatStatus {
  AVAILABLE,
  RESERVED,
}

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
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
  showtime: Showtime[];
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
  showtimes: Showtime[];
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
