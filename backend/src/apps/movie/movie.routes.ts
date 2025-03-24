import express from "express";
import movieController from "./entry-points/movie.controller";

const router = express.Router();

router.post("/movies", movieController.createMovie);

export default router;
