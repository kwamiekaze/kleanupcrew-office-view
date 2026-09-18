import { useEffect, useRef } from "react";
import { SERVICE_OPTIONS } from "@/lib/kleanup-content";

export function QuoteDrawer({
  open,
  onClose,
  service,
}: {
  open: boolean;
  onClose: () => void;
  service?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close quote form"
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        className="kc-glass relative m-0 w-full max-w-lg rounded-t-2xl p-5 sm:m-4 sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="quote-title" className="text-lg font-semibold text-cream">
              Get a free quote
            </h2>
            <p className="mt-1 text-xs text-cream/70">
              Tell us about the property. No payment details needed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="kc-focus rounded-full border border-cream/25 px-2 py-1 text-xs text-cream/80 hover:bg-cream/10"
          >
            Close
          </button>
        </div>

        <form
          className="mt-4 grid grid-cols-2 gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="col-span-2 sm:col-span-1 kc-field">
            <span>Name</span>
            <input ref={firstRef} type="text" placeholder="Jordan Ellis" />
          </label>
          <label className="col-span-2 sm:col-span-1 kc-field">
            <span>Email or phone</span>
            <input type="text" placeholder="you@email.com / (555) 010-2233" />
          </label>
          <label className="col-span-1 kc-field">
            <span>ZIP code</span>
            <input type="text" inputMode="numeric" placeholder="30044" />
          </label>
          <label className="col-span-1 kc-field">
            <span>Service</span>
            <select defaultValue={service ?? SERVICE_OPTIONS[0]}>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="col-span-2 kc-field">
            <span>Describe the job</span>
            <textarea
              rows={3}
              placeholder="Overgrown back yard, two rooms to clear out, needs to look good again before listing."
            />
          </label>
          <div className="col-span-2">
            <span className="mb-1.5 block text-[11px] uppercase tracking-wide text-cream/60">
              Photos (coming soon)
            </span>
            <div
              aria-disabled="true"
              className="flex items-center justify-center rounded-xl border border-dashed border-cream/25 px-4 py-5 text-center text-xs text-cream/55"
            >
              Photo upload will be enabled shortly — describe the job for now.
            </div>
          </div>
          <button type="submit" className="kc-btn col-span-2 mt-1 justify-center">
            Request my estimate
          </button>
          <p className="col-span-2 text-center text-[11px] text-cream/50">
            Preview only — nothing is submitted yet.
          </p>
        </form>
      </div>
    </div>
  );
}
