/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_MIDTRANS_CLIENT_KEY?: string;
  readonly VITE_MIDTRANS_SNAP_SCRIPT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type MidtransPaymentResult = {
  status_code?: string;
  status_message?: string;
  transaction_id?: string;
  order_id?: string;
  gross_amount?: string;
  payment_type?: string;
  transaction_time?: string;
  transaction_status?: string;
  fraud_status?: string;
};

type MidtransSnapPayCallbacks = {
  onSuccess?: (result: MidtransPaymentResult) => void;
  onPending?: (result: MidtransPaymentResult) => void;
  onError?: (result: MidtransPaymentResult) => void;
  onClose?: () => void;
};

interface Window {
  snap?: {
    pay: (token: string, callbacks?: MidtransSnapPayCallbacks) => void;
  };
}
