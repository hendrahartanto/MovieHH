import { Location } from "@/features/locations/types";
import { MovieSchedule } from "@/features/movie-schedules/types";

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  HOLD = "HOLD",
  RESERVED = "RESERVED",
}

export type Seat = {
  id: string;
  seatNumber: string;
  seatRow: string;
  //theater
  //reservations
  //showTimes
};

export type Theater = {
  id: string;
  name: string;
  seats: Seat[];
  layout?: (0 | 1)[][];
  locationId: string;
  location?: Location;
  movieSchedules: MovieSchedule[];
  createdAt: Date;
};
