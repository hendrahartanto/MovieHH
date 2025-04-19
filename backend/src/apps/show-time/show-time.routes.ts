import express from "express";
import showTimeController from "./entry-points/show-time.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/", authorize(Role.ADMIN), showTimeController.createShowTime);
router.get("/", showTimeController.getShowTimeByDate);
router.get("/:showTimeId/seats", showTimeController.getShowTimeSeats);

export default router;
