import express from "express";
import theaterController from "./entry-points/theater.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", theaterController.getTheaters);
router.get("/:theaterId", theaterController.getTheater);

//-------------------------------//
router.use(authenticate, authorize(Role.ADMIN));
//-------------------------------//
router.post("/", theaterController.createTheater);
router.put("/:theaterId", theaterController.updateTheater);
router.delete("/:theaterId", theaterController.deleteTheater);

export default router;
