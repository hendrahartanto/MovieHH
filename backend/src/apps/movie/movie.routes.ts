import express from "express";
import movieController from "./entry-points/movie.controller";

const router = express.Router();

router.post("/", movieController.createMovie);
router.get("/", movieController.getMovies);
router.put("/:movieId", movieController.updateMovie);
router.delete("/:movieId", movieController.deleteMovie);

export default router;
