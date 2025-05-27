import express from "express";
import movieController from "./entry-points/movie.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", movieController.getMovies);
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  movieController.createMovie
);
router.put(
  "/:movieId",
  authenticate,
  authorize(Role.ADMIN),
  movieController.updateMovie
);
router.delete(
  "/:movieId",
  authenticate,
  authorize(Role.ADMIN),
  movieController.deleteMovie
);

export default router;
