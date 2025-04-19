import express from "express";
import theaterController from "./entry-points/theater.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

//-------------------------------//
router.use(authenticate, authorize(Role.ADMIN));
//-------------------------------//

router.post("/", theaterController.createTheater);

export default router;
