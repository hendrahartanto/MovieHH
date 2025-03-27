import express from "express";
import showTimeController from "./entry-points/show-time.controller";

const router = express.Router();

router.post("/show-times", showTimeController.createShowTime);

export default router;
