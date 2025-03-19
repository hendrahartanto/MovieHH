import express from "express";
import authController from "./entry-points/auth.controller";

const router = express.Router();

router.use("/register", authController.register);

export default router;
