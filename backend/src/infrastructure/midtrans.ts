import midtransClient from "midtrans-client";

type MidtransTransactionClient = {
  cancel: (transactionId: string) => Promise<unknown>;
  expire: (transactionId: string) => Promise<unknown>;
  status: (transactionId: string) => Promise<any>;
};

type MidtransSnapWithTransaction = {
  transaction: MidtransTransactionClient;
};

export const midtransSnap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

const midtransTransaction = (midtransSnap as unknown as MidtransSnapWithTransaction)
  .transaction;

export const cancelMidtransTransaction = (transactionId: string) => {
  return midtransTransaction.cancel(transactionId);
};

export const expireMidtransTransaction = (transactionId: string) => {
  return midtransTransaction.expire(transactionId);
};

export const getMidtransTransactionStatus = (transactionId: string) => {
  return midtransTransaction.status(transactionId);
};

