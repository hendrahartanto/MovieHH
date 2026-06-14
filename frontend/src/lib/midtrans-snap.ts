const MIDTRANS_SNAP_SCRIPT_ID = "midtrans-snap-script";
const DEFAULT_MIDTRANS_SNAP_SCRIPT_URL =
  "https://app.sandbox.midtrans.com/snap/snap.js";

let snapLoadPromise: Promise<void> | null = null;

type LoadMidtransSnapOptions = {
  clientKey?: string;
  scriptUrl?: string;
};

export const loadMidtransSnap = ({
  clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY,
  scriptUrl =
    import.meta.env.VITE_MIDTRANS_SNAP_SCRIPT_URL ||
    DEFAULT_MIDTRANS_SNAP_SCRIPT_URL,
}: LoadMidtransSnapOptions = {}) => {
  if (window.snap) {
    return Promise.resolve();
  }

  if (!clientKey) {
    return Promise.reject(
      new Error("Missing VITE_MIDTRANS_CLIENT_KEY environment variable"),
    );
  }

  if (snapLoadPromise) {
    return snapLoadPromise;
  }

  snapLoadPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      MIDTRANS_SNAP_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const script = existingScript || document.createElement("script");

    const handleLoad = () => {
      if (window.snap) {
        resolve();
        return;
      }

      snapLoadPromise = null;
      reject(new Error("Midtrans Snap failed to initialize"));
    };

    const handleError = () => {
      snapLoadPromise = null;
      reject(new Error("Failed to load Midtrans Snap script"));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.id = MIDTRANS_SNAP_SCRIPT_ID;
      script.src = scriptUrl;
      script.async = true;
      script.setAttribute("data-client-key", clientKey);
      document.body.appendChild(script);
    }
  });

  return snapLoadPromise;
};
