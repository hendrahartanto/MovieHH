import express from "express";
import webhookController from "./entry-points/webhook.controller";

const router = express.Router();

router.post("/midtrans", webhookController.handleMidtransNotification);

export default router;
