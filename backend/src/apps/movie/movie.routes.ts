import express from "express";
import movieController from "./entry-points/movie.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { upload } from "../../middlewares/upload.middleware";

const router = express.Router();

router.get("/", movieController.getMovies);
router.get("/featured", movieController.getFeaturedMovies);
router.get("/active", movieController.getActiveMovies);
router.get("/:movieId", movieController.getMovie);
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  movieController.createMovie
);
router.put(
  "/:movieId",
  authenticate,
  authorize(Role.ADMIN),
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  movieController.updateMovie
);
router.delete(
  "/:movieId",
  authenticate,
  authorize(Role.ADMIN),
  movieController.deleteMovie
);

export default router;
