import express from "express";
import auth from "../apps/auth/auth.routes";
import movie from "../apps/movie/movie.routes";
import genre from "../apps/genre/genre.routes";

const router = express.Router();

router.use("/auth", auth);
router.use("/movie", movie);
router.use("/genre", genre);

export default router;
