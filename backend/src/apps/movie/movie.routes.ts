import express from "express";
import movieController from "./entry-points/movie.controller";

const router = express.Router();

router.post("/movies", movieController.createMovie);
router.put("/movies/:movieId", movieController.updateMovie);

export default router;
