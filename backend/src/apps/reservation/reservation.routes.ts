import express from "express";
import reservationController from "./entry-points/reservation.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = express.Router();

//-------------------------------//
router.use(authenticate);
//-------------------------------//

router.post("/hold", reservationController.createReservationHold);
router.post("/payment", reservationController.createReservationPayment);
router.post("/cancel", reservationController.cancelReservation);

export default router;
