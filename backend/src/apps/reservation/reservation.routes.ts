import express from "express";
import reservationController from "./entry-points/reservation.controller";
import { authenticate } from "../../middlewares/auth.middleware";

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
router.get("/:id", reservationController.getReservation);

export default router;
