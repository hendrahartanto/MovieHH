import { Queue, Worker } from "bullmq";
import prisma from "../db";
import { redisConnection } from "../infrastructure/redis";
import showTimeRepository from "../apps/show-time/data-access/show-time.repository";
import reservationRepository from "../apps/reservation/data-access/reservation.repository";

export const reservationHoldQueue = new Queue("reservation-hold-queue", {
  connection: redisConnection,
});

new Worker(
  "reservation-hold-queue",
  async (job) => {
    const { reservationId, seatIds, showTimeId } = job.data;

    await prisma.$transaction(async (tx) => {
      const expiredReservation =
        await reservationRepository.expirePendingReservation(
          reservationId,
          tx
        );

      if (expiredReservation.count === 0) {
        return;
      }

      await reservationRepository.updatePaymentStatusByReservationId(
        reservationId,
        "EXPIRED",
        tx
      );
      await showTimeRepository.releaseHeldSeats(showTimeId, seatIds, tx);
    });

    //TODO: handle io socket for real time seat status update
  },
  { connection: redisConnection }
);
