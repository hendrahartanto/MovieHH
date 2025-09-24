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
    const { reserationId } = req.body;
    const userId = req.user.id;

    const paymentToken = await reservationService.createPaymentToken(
      reserationId,
      userId
    );

    new SuccessResponse("Create payment token successful", paymentToken).send(
      res
    );
  }
);

const reserve = asyncHandler<ProtectedRequest>(async (req, res) => {
  //TODO: rombak logic
  // const validatedData = createReservationSchema.parse(req.body);
  // const userId = req.user.id;
  // const newReservation = await reservationService.reserve(
  //   validatedData,
  //   userId
  // );
  // new SuccessResponse("Reserve succesful", { newReservation }).send(res);
});

export default {
  createReservationHold,
  createReservationPayment,
  reserve,
};
