import express from "express";
import showTimeController from "./entry-points/show-time.controller";

const router = express.Router();

router.post("/", showTimeController.createShowTime);
router.get("/", showTimeController.getShowTimeByDate);
router.get("/:showTimeId/seats", showTimeController.getShowTimeSeats);

export default router;
