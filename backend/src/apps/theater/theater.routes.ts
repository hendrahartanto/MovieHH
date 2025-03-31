import express from "express";
import theaterController from "./entry-points/theater.controller";

const router = express.Router();

router.post("/theatersl", theaterController.createTheater);

export default router;
