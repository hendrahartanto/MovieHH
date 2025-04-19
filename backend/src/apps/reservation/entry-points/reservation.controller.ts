import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { ProtectedRequest } from "../../../types/app-requests";
import { createReservationSchema } from "../domain/dto/create-reservation.dto";
import reservationService from "../domain/reservation.service";

const reserve = asyncHandler<ProtectedRequest>(async (req, res) => {
  const validatedData = createReservationSchema.parse(req.body);
  // const { userId } = req.user;
  // const newReservation = await reservationService.reserve(
  // validatedData,
  // userId
  // );

  // new SuccessResponse("Reserve succesful", { newReservation }).send(res);
});

export default {
  reserve,
};
