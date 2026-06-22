import express from "express";
import authController from "./entry-points/auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refreshAccessToken);
router.get("/me", authController.me);
router.put("/change-password", authenticate, authController.changePassword);

export default router;
