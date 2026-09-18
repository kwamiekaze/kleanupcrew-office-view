import { useEffect, useRef } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
let scriptPromise: Promise<void> | undefined;

function loadVerification() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise)
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        scriptPromise = undefined;
        reject(new Error("Verification unavailable"));
      };
      document.head.append(script);
    });
  return scriptPromise;
}

export function QuoteVerification({
  siteKey,
  attempt,
  onToken,
  onError,
}: {
  siteKey: string;
  attempt: number;
  onToken: (token: string) => void;
  onError: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let widget: string | undefined;
    onToken("");
    void loadVerification()
      .then(() => {
        if (disposed || !container.current || !window.turnstile) return;
        widget = window.turnstile.render(container.current, {
          sitekey: siteKey,
          action: "quote",
          theme: "dark",
          size: "flexible",
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => {
            onToken("");
            onError();
          },
        });
      })
      .catch(() => {
        if (!disposed) onError();
      });
    return () => {
      disposed = true;
      if (widget !== undefined) window.turnstile?.remove(widget);
    };
  }, [siteKey, attempt, onToken, onError]);
  return <div ref={container} className="min-h-16" aria-label="Spam protection" />;
}
