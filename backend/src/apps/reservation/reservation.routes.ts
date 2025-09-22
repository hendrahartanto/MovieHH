import express from "express";
import reservationController from "./entry-points/reservation.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = express.Router();

//-------------------------------//
router.use(authenticate);
//-------------------------------//

router.post("/hold", reservationController.createReservationHold);

export default router;
