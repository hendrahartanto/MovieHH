import { SuccessResponse } from "../../../lib/http/api-response";
import asyncHandler from "../../../lib/utils/async.util";
import { ProtectedRequest } from "../../../types/app-requests";
import { cancelReservationSchema } from "../dto/cancel-reservation.dto";
import { createReservationHoldSchema } from "../dto/create-reservation-hold.dto";
import { createReservationPaymentSchema } from "../dto/create-reservation-payment.dto";
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
    const validatedData = createReservationPaymentSchema.parse(req.body);
    const { reservationId } = validatedData;
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

const getActiveReservationPayment = asyncHandler<ProtectedRequest>(
  async (req, res) => {
    const userId = req.user.id;

    const activePayment = await reservationService.getActiveReservationPayment(
      userId
    );

    new SuccessResponse("Get active reservation payment successful", {
      activePayment,
    }).send(res);
  }
);

const cancelReservation = asyncHandler<ProtectedRequest>(async (req, res) => {
  const validatedData = cancelReservationSchema.parse(req.body);
  const { reservationId } = validatedData;
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
  getActiveReservationPayment,
  cancelReservation,
};
