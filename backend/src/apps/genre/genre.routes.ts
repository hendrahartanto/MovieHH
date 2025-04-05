import express from "express";
import genreController from "./entry-points/genre.controller";

const router = express.Router();

router.post("/", genreController.createGenre);

export default router;
