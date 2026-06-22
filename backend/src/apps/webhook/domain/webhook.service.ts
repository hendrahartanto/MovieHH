import crypto from "crypto";
import prisma from "../../../db";
import {
  BadRequestError,
  ForbiddenError,
  NoDataError,
} from "../../../lib/exceptions/api-error";
import reservationRepository from "../../reservation/data-access/reservation.repository";
import showTimeRepository from "../../show-time/data-access/show-time.repository";
import { reservationHoldQueue } from "../../../queue/reservation-hold-queue";
import { broadcastSeatStatus } from "../../../infrastructure/socket";

type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
};

type ReservationWithDetails = NonNullable<
  Awaited<ReturnType<typeof reservationRepository.getReservationById>>
>;

const removeReservationHoldJob = async (reservationId: string) => {
  const jobToRemove = await reservationHoldQueue.getJob(reservationId);
  if (jobToRemove) {
    await jobToRemove.remove();
  }
};

const confirmReservationPayment = async (
  reservation: ReservationWithDetails,
) => {
  if (reservation.status === "CONFIRMED") {
    return;
  }

  if (reservation.status !== "PENDING") {
    return;
  }

  if (reservation.expiresAt <= new Date()) {
    return;
  }

  await removeReservationHoldJob(reservation.id);

  await prisma.$transaction(async (tx) => {
    await showTimeRepository.updateManySeatStatus(
      reservation.showTimeId,
      reservation.reservationDetails.map((detail) => detail.seatId),
      "RESERVED",
      tx,
    );

    await reservationRepository.updateReservationStatus(
      reservation.id,
      "CONFIRMED",
      tx,
    );
    await reservationRepository.updatePaymentStatusByReservationId(
      reservation.id,
      "PAID",
      tx,
    );
  });

  broadcastSeatStatus(
    reservation.showTimeId,
    reservation.reservationDetails.map((detail) => detail.seatId),
    "RESERVED"
  );
};

const releaseReservationPayment = async (
  reservation: ReservationWithDetails,
  reservationStatus: "CANCELLED" | "EXPIRED",
  paymentStatus: "CANCELLED" | "EXPIRED" | "FAILED",
) => {
  if (reservation.status !== "PENDING") {
    return;
  }

  await removeReservationHoldJob(reservation.id);

  await prisma.$transaction(async (tx) => {
    await reservationRepository.updateReservationStatus(
      reservation.id,
      reservationStatus,
      tx,
    );
    await reservationRepository.updatePaymentStatusByReservationId(
      reservation.id,
      paymentStatus,
      tx,
    );
    await showTimeRepository.updateManySeatStatus(
      reservation.showTimeId,
      reservation.reservationDetails.map((detail) => detail.seatId),
      "AVAILABLE",
      tx,
    );
  });

  broadcastSeatStatus(
    reservation.showTimeId,
    reservation.reservationDetails.map((detail) => detail.seatId),
    "AVAILABLE"
  );
};

const handleMidtransNotification = async (notification: MidtransNotification) => {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
  } = notification;

  if (
    !order_id ||
    !status_code ||
    !gross_amount ||
    !signature_key ||
    !transaction_status
  ) {
    throw new BadRequestError("Invalid Midtrans notification payload");
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (signature_key !== expectedSignature)
    throw new ForbiddenError("Invalid signature");

  const reservation = await reservationRepository.getReservationById(order_id);
  if (!reservation) throw new NoDataError("Reservation not found");

  console.log("transaction status: ", transaction_status);

  if (transaction_status === "pending") {
    if (reservation.status !== "PENDING") {
      return;
    }

    await reservationRepository.updatePaymentStatusByReservationId(
      order_id,
      "PENDING",
    );
    return;
  }

  if (transaction_status === "settlement") {
    await confirmReservationPayment(reservation);
    return;
  }

  if (transaction_status === "capture") {
    if (!fraud_status || fraud_status === "accept") {
      await confirmReservationPayment(reservation);
      return;
    }

    if (reservation.status !== "PENDING") {
      return;
    }

    await reservationRepository.updatePaymentStatusByReservationId(
      order_id,
      "PENDING",
    );
    return;
  }

  if (transaction_status === "cancel") {
    await releaseReservationPayment(reservation, "CANCELLED", "CANCELLED");
    return;
  }

  if (transaction_status === "expire") {
    await releaseReservationPayment(reservation, "EXPIRED", "EXPIRED");
    return;
  }

  if (transaction_status === "deny" || transaction_status === "failure") {
    await releaseReservationPayment(reservation, "CANCELLED", "FAILED");
  }
};

export default {
  handleMidtransNotification,
};
