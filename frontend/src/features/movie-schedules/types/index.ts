import { Movie } from "@/features/movies/types";
import { Seat, SeatStatus, Theater } from "@/features/theaters/types";

export type { Seat, Theater };
export { SeatStatus };

export type Showtime = {
  id: string;
  startTime: Date;
  endTime: Date;
  seats: Seat[];
  createdAt: Date;
  updatedAt: Date;
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

export type SeatsOnShowtimes = {
  seat: Seat;
  showtime: Showtime;
  status: SeatStatus;
};
