import express from "express";
import authController from "./entry-points/auth.controller";

const router = express.Router();

router.post("/register", authController.register);

export default router;
