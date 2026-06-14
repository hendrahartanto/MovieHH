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
