import express from "express";
import movieController from "./entry-points/movie.controller";

const router = express.Router();

router.post("/movies", movieController.createMovie);
router.get("/movies", movieController.getMovies);
router.put("/movies/:movieId", movieController.updateMovie);
router.delete("/movies/:movieId", movieController.deleteMovie);

export default router;
