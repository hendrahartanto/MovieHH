import express from "express";
import auth from "../apps/auth/auth.routes";
import movie from "../apps/movie/movie.routes";
import genre from "../apps/genre/genre.routes";
import showTime from "../apps/show-time/show-time.routes";
import reservation from "../apps/reservation/reservation.routes";

const router = express.Router();

router.use("/auth", auth);
router.use("/movie", movie);
router.use("/genre", genre);
router.use("/show-time", showTime);
router.use("/reservation", reservation);

export default router;
