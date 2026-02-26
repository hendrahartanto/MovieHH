import { SuccessMsgResponse } from "../../../lib/http/api-response";
import asyncHandler from "../../../lib/utils/async.util";
import webhookService from "../domain/webhook.service";

const handleMidtransNotification = asyncHandler(async (req, res) => {
  const notification = req.body;
  await webhookService.handleMidtransNotification(notification);

  new SuccessMsgResponse("Payment successful");
});

export default {
  handleMidtransNotification,
};
