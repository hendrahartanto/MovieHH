import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { ProtectedRequest } from "../../../types/app-requests";
import { createReservationHoldSchema } from "../domain/dto/create-reservation-hold.dto";
import reservationService from "../domain/reservation.service";

const createReservationHold = asyncHandler<ProtectedRequest>(
  async (req, res) => {
    const validatedData = createReservationHoldSchema.parse(req.body);
    const userId = req.user.id;

    const newReservationHold = await reservationService.createReservationHold(
      validatedData,
      userId
    );
    new SuccessResponse("Create reservation hold successful", {
      newReservationHold,
    }).send(res);
  }
);

const createReservationPayment = asyncHandler<ProtectedRequest>(
  async (req, res) => {
    const { reservationId } = req.body;
    const userId = req.user.id;

    const paymentToken = await reservationService.createPaymentToken(
      reservationId,
      userId
    );

    new SuccessResponse("Create payment token successful", paymentToken).send(
      res
    );
  }
);

const cancelReservation = asyncHandler<ProtectedRequest>(async (req, res) => {
  const { reservationId } = req.body;
  const userId = req.user.id;

  const cancelledReservation = await reservationService.cancelReservation(
    reservationId,
    userId
  );

  new SuccessResponse("Cancel reservation successful", {
    cancelledReservation,
  }).send(res);
});

export default {
  createReservationHold,
  createReservationPayment,
  cancelReservation,
};
