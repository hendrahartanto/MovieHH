import express from "express";
import reservationController from "./entry-points/reservation.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

//-------------------------------//
router.use(authenticate);
//-------------------------------//

router.get("/active-payment", reservationController.getActiveReservationPayment);
router.get("/active", reservationController.getActiveReservations);
router.get("/history", reservationController.getTransactionHistory);
router.post("/hold", reservationController.createReservationHold);
router.post("/payment", reservationController.createReservationPayment);
router.post("/cancel", reservationController.cancelReservation);
router.get("/admin", authorize(Role.ADMIN), reservationController.getReservationsAdmin);
router.get("/admin/:id", authorize(Role.ADMIN), reservationController.getReservationAdmin);
router.post("/admin/:id/cancel", authorize(Role.ADMIN), reservationController.cancelReservationAdmin);
router.post("/:id/check-in", authorize(Role.ADMIN), reservationController.checkInReservation);
router.get("/:id", reservationController.getReservation);

export default router;
