import express from "express";
import reservationController from "./entry-points/reservation.controller";

const router = express.Router();

router.post("/", reservationController.reserve);

export default router;
