import crypto from "crypto";
import { ForbiddenError, NoDataError } from "../../../core/api-error";
import reservationRepository from "../../reservation/data-access/reservation.repository";
import showTimeRepository from "../../show-time/data-access/show-time.repository";

const handleMidtransNotification = async (notification: any) => {
  const { orderId, statusCode, grossAmount, signatureKey, transactionStatus } =
    notification;
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");

  if (signatureKey !== expectedSignature)
    throw new ForbiddenError("Invalid signature");

  const reservation = await reservationRepository.getReservationById(orderId);
  if (!reservation) throw new NoDataError("Reservation not found");

  if (transactionStatus === "settlement") {
    await showTimeRepository.updateManySeatStatus(
      reservation.showTimeId,
      reservation.reservationDetails.map((detail) => detail.seatId),
      "RESERVED"
    );

    await reservationRepository.updateReservationStatus(orderId, "CONFIRMED");
  }

  //TODO: handle kalau dia cancel, dll
};

export default {
  handleMidtransNotification,
};
