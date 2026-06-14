export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export type Reservation = {
  id: string;
  userId: string;
  showTimeId: string;
  status: ReservationStatus;
  totalPrice: string | number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ReservationSeat = {
  id: string;
  seatNumber: string;
  seatRow: string;
  theaterId?: string;
};

export type ReservationDetail = {
  id: string;
  reservationId: string;
  seatId: string;
  seat: ReservationSeat;
};

export type ActiveReservation = Omit<Reservation, "createdAt"> & {
  createdAt?: string;
  createAt?: string;
  reservationDetails: ReservationDetail[];
  showTime: {
    id: string;
    startTime: string;
    endTime: string;
    movieSchedule: {
      price: string | number;
      date: string;
      movie?: {
        title: string;
      };
      theater?: {
        name: string;
      };
    };
  };
};

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED";

export type PaymentToken = {
  id: string;
  reservationId: string;
  token: string;
  redirectUrl: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export type ActiveReservationPayment = {
  reservation: ActiveReservation;
  payment: PaymentToken | null;
};
