import express from "express";
import showTimeController from "./entry-points/show-time.controller";

const router = express.Router();

router.post("/show-times", showTimeController.createShowTime);
router.get("/show-times", showTimeController.getShowTimeByDate);

export default router;
