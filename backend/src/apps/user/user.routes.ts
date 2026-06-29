import express from "express";
import userController from "./entry-points/user.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.use(authenticate, authorize(Role.ADMIN));

router.get("/admin", userController.getUsersAdmin);
router.put("/admin/:id/role", userController.updateUserRoleAdmin);
router.put("/admin/:id/suspend", userController.toggleUserSuspensionAdmin);

export default router;
