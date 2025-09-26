import crypto from "crypto";
import { ForbiddenError, NoDataError } from "../../../core/api-error";
import reservationRepository from "../../reservation/data-access/reservation.repository";
import showTimeRepository from "../../show-time/data-access/show-time.repository";
import { reservationHoldQueue } from "../../../queue/reservation-hold-queue";

const handleMidtransNotification = async (notification: any) => {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
  } = notification;

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

  if (transaction_status === "settlement" || transaction_status === "capture") {
    const jobToRemove = await reservationHoldQueue.getJob(reservation.id);
    if (jobToRemove) {
      await jobToRemove.remove();
    }

    await showTimeRepository.updateManySeatStatus(
      reservation.showTimeId,
      reservation.reservationDetails.map((detail) => detail.seatId),
      "RESERVED"
    );

    await reservationRepository.updateReservationStatus(order_id, "CONFIRMED");
  }

  //TODO: handle cancel, expire, dll
};

export default {
  handleMidtransNotification,
};
