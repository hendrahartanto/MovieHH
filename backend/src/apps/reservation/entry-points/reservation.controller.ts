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
    const { reservationId, returnUrl } = validatedData;
    const userId = req.user.id;

    const paymentToken = await reservationService.createPaymentToken(
      reservationId,
      userId,
      returnUrl
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

const getActiveReservations = asyncHandler<ProtectedRequest>(
  async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { reservations, total } = await reservationService.getActiveReservations(
      userId,
      page,
      limit
    );

    new SuccessResponse("Get active reservations successful", {
      activeReservations: reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }).send(res);
  }
);

const getTransactionHistory = asyncHandler<ProtectedRequest>(
  async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { reservations, total } = await reservationService.getTransactionHistory(
      userId,
      page,
      limit
    );

    new SuccessResponse("Get transaction history successful", {
      transactionHistory: reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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

const getReservation = asyncHandler<ProtectedRequest>(async (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.id;

  const reservation = await reservationService.getReservation(
    reservationId,
    userId
  );

  new SuccessResponse("Get reservation successful", {
    reservation,
  }).send(res);
});

const checkInReservation = asyncHandler<ProtectedRequest>(async (req, res) => {
  const reservationId = req.params.id;
  const updatedReservation =
    await reservationService.checkInReservation(reservationId);

  new SuccessResponse("Reservation checked in successfully", {
    reservation: updatedReservation,
  }).send(res);
});

export default {
  createReservationHold,
  createReservationPayment,
  getActiveReservationPayment,
  getActiveReservations,
  getTransactionHistory,
  cancelReservation,
  getReservation,
  checkInReservation,
};
