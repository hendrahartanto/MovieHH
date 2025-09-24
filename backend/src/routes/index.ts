import express from "express";
import auth from "../apps/auth/auth.routes";
import movie from "../apps/movie/movie.routes";
import genre from "../apps/genre/genre.routes";
import showTime from "../apps/show-time/show-time.routes";
import reservation from "../apps/reservation/reservation.routes";
import theater from "../apps/theater/theater.routes";
import location from "../apps/location/location.routes";
import webhook from "../apps/webhook/webhook.routes";

const router = express.Router();

router.use("/auth", auth);
router.use("/movies", movie);
router.use("/show-times", showTime);
router.use("/reservations", reservation);
router.use("/theaters", theater);
router.use("/genres", genre);
router.use("/locations", location);
router.use("/webhook", webhook);

export default router;
