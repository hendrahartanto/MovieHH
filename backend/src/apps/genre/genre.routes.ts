import express from "express";
import genreController from "./entry-points/genre.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

//-------------------------------//
router.use(authenticate, authorize(Role.ADMIN));
//-------------------------------//

router.post("/", genreController.createGenre);

export default router;
