import { Queue, Worker } from "bullmq";
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

    await reservationRepository.updateReservationStatus(
      reservationId,
      "EXPIRED"
    );

    await showTimeRepository.updateManySeatStatus(
      showTimeId,
      seatIds,
      "AVAILABLE"
    );

    //TODO: handle io socket for real time seat status update
  },
  { connection: redisConnection }
);
