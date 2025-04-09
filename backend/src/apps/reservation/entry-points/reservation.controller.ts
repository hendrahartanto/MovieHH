import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createReservationSchema } from "../domain/dto/create-reservation.dto";
import reservationService from "../domain/reservation.service";

const reserve = asyncHandler(async (req, res) => {
  const validatedData = createReservationSchema.parse(req.body);
  const newReservation = await reservationService.reserve(validatedData);

  new SuccessResponse("Reserve succesful", { newReservation }).send(res);
});

export default {
  reserve,
};
