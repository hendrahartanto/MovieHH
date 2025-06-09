import express from "express";
import authController from "./entry-points/auth.controller";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refreshAccessToken);

export default router;
