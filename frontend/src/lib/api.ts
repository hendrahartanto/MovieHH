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
  //genres
  //showTimes
  createdAt: Date;
  updatedAt: Date;
};

export type Genre = {
  id: string;
  name: string;
  //movies
  createdAt: Date;
  updatedAt: Date;
};

export type Theater = {
  id: string;
  name: string;
  //seats
  //showTimes
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
  //seats
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
