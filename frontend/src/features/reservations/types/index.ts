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

export type PaymentToken = {
  token: string;
  redirectUrl: string;
};
