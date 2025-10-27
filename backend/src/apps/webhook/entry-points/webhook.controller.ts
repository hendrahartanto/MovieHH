import { SuccessMsgResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import webhookService from "../domain/webhook.service";

const handleMidtransNotification = asyncHandler(async (req, res) => {
  const notification = req.body;
  await webhookService.handleMidtransNotification(notification);

  new SuccessMsgResponse("Payment successful");
});

export default {
  handleMidtransNotification,
};
