import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Camera, Check, ImagePlus, X } from "lucide-react";
import { SERVICE_FOR_VIEW, SERVICE_OPTIONS, type ViewId } from "@/lib/kleanup-content";
import { MAX_PHOTOS, PHOTO_ACCEPT, prepareQuotePhoto } from "@/lib/quote-photos";
import { QuoteVerification } from "./QuoteVerification";

type Photo = { id: string; file: File; url: string };
type DeliveryConfig = { enabled: boolean; siteKey: string | null };
const EMPTY_FIELDS = { name: "", contact: "", zip: "", service: "", description: "" };

export function QuoteDrawer({
  open,
  onClose,
  viewId,
}: {
  open: boolean;
  onClose: () => void;
  viewId: ViewId;
}) {
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [config, setConfig] = useState<DeliveryConfig | null>(null);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const photoInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const urls = useRef(new Set<string>());
  const processingRef = useRef(false);
  const mounted = useRef(true);
  const requestId = useRef("");
  const lastPayload = useRef("");
  const selectedService = fields.service || SERVICE_FOR_VIEW[viewId];

  useEffect(() => {
    mounted.current = true;
    const ownedUrls = urls.current;
    return () => {
      mounted.current = false;
      ownedUrls.forEach(URL.revokeObjectURL);
      ownedUrls.clear();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    setConfig(null);
    setToken("");
    void fetch("/api/quotes", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        const result = (await response.json()) as DeliveryConfig;
        if (!controller.signal.aborted)
          setConfig({
            enabled: result.enabled === true,
            siteKey: typeof result.siteKey === "string" ? result.siteKey : null,
          });
      })
      .catch(() => {
        if (mounted.current) setConfig({ enabled: false, siteKey: null });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [open]);

  const verificationError = useCallback(
    () => setError("Verification could not load. Check your connection and reopen the form."),
    [],
  );

  function update(field: keyof typeof fields, value: string) {
    setFields((previous) => ({ ...previous, [field]: value }));
    setError("");
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length || processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);
    setPhotoError("");
    const additions: Photo[] = [];
    const errors: string[] = [];
    const available = MAX_PHOTOS - photos.length;
    if (files.length > available)
      errors.push(`You can attach up to ${MAX_PHOTOS} photos. Extra photos were not added.`);
    for (const source of Array.from(files).slice(0, available)) {
      try {
        const file = await prepareQuotePhoto(source);
        if (!mounted.current) break;
        const url = URL.createObjectURL(file);
        urls.current.add(url);
        additions.push({ id: crypto.randomUUID(), file, url });
      } catch (cause) {
        errors.push(cause instanceof Error ? cause.message : "A photo could not be added.");
      }
    }
    if (mounted.current) {
      setPhotos((previous) => [...previous, ...additions]);
      setPhotoError([...new Set(errors)].join(" "));
      setProcessing(false);
    }
    processingRef.current = false;
  }

  function removePhoto(photo: Photo) {
    URL.revokeObjectURL(photo.url);
    urls.current.delete(photo.url);
    setPhotos((previous) => previous.filter((item) => item.id !== photo.id));
    setPhotoError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config?.enabled || (config.siteKey && !token) || sending || processing) return;
    setSending(true);
    setError("");
    const body = new FormData(event.currentTarget);
    const fingerprint = JSON.stringify({
      ...fields,
      service: selectedService,
      photos: photos.map((photo) => photo.id),
    });
    if (!requestId.current || lastPayload.current !== fingerprint) {
      requestId.current = crypto.randomUUID();
      lastPayload.current = fingerprint;
    }
    body.set("requestId", requestId.current);
    body.set("token", token);
    photos.forEach((photo) => body.append("photos", photo.file));
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        body,
        signal: AbortSignal.timeout(45000),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok)
        throw new Error(result.error || "Your request could not be sent. Please try again.");
      setSent(true);
      setFields(EMPTY_FIELDS);
      urls.current.forEach(URL.revokeObjectURL);
      urls.current.clear();
      setPhotos([]);
      requestId.current = "";
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name !== "TimeoutError"
          ? cause.message
          : "The connection timed out. Your details are saved here so you can try again.",
      );
    } finally {
      setSending(false);
      setToken("");
      setAttempt((previous) => previous + 1);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && !sending) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-[3px]" />
        <Dialog.Content
          ref={dialog}
          tabIndex={-1}
          className="kc-quote-dialog text-cream"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            dialog.current?.focus();
          }}
          onEscapeKeyDown={(event) => {
            if (sending) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (sending) event.preventDefault();
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">
                {sent ? "Request sent" : "Get a free quote"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-cream/70">
                {sent
                  ? "Your request has been accepted for delivery to KleanupCrew."
                  : "Tell us what needs attention and we will come and price it."}
              </Dialog.Description>
            </div>
            <Dialog.Close
              disabled={sending}
              className="kc-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/25 hover:bg-cream/10"
              aria-label="Close quote form"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          {sent ? (
            <div className="py-8 text-center">
              <Check className="mx-auto mb-3 text-lime" size={36} />
              <p>Your job details and any attached photos are on their way.</p>
              <button
                type="button"
                className="kc-btn mt-5"
                onClick={() => {
                  setSent(false);
                  onClose();
                }}
              >
                Back to the office
              </button>
            </div>
          ) : (
            <form className="mt-5 grid grid-cols-2 gap-4" onSubmit={submit}>
              <label className="kc-field col-span-2 sm:col-span-1">
                <span>Name</span>
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={fields.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  disabled={sending}
                />
              </label>
              <label className="kc-field col-span-2 sm:col-span-1">
                <span>Email or phone</span>
                <input
                  name="contact"
                  required
                  minLength={6}
                  maxLength={160}
                  value={fields.contact}
                  onChange={(e) => update("contact", e.target.value)}
                  placeholder="How can we reach you?"
                  disabled={sending}
                />
              </label>
              <label className="kc-field col-span-2 sm:col-span-1">
                <span>ZIP code</span>
                <input
                  name="zip"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                  pattern="[0-9]{5}(-[0-9]{4})?"
                  maxLength={10}
                  value={fields.zip}
                  onChange={(e) => update("zip", e.target.value)}
                  placeholder="12345"
                  disabled={sending}
                />
              </label>
              <label className="kc-field col-span-2 sm:col-span-1">
                <span>Service</span>
                <select
                  name="service"
                  value={selectedService}
                  onChange={(e) => update("service", e.target.value)}
                  required
                  disabled={sending}
                >
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </label>
              <label className="kc-field col-span-2">
                <span>
                  {selectedService === "Other"
                    ? "Describe the service you need"
                    : "Describe the job"}
                </span>
                <textarea
                  name="description"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={3}
                  value={fields.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder={
                    selectedService === "Other"
                      ? "Tell us what you need, even if it isn’t listed. Include the location, size and timing of the job."
                      : "What needs cleaning, clearing or care? Tell us about the size of the job and your preferred timing."
                  }
                  disabled={sending}
                />
              </label>

              <fieldset
                className="col-span-2 min-w-0"
                disabled={sending || processing || photos.length >= MAX_PHOTOS}
              >
                <legend className="mb-2 text-sm font-medium">
                  Photos <span className="text-cream/60">(optional)</span>
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="kc-photo-btn kc-focus"
                    onClick={() => photoInput.current?.click()}
                  >
                    <ImagePlus size={18} aria-hidden="true" /> Add photos
                  </button>
                  <button
                    type="button"
                    className="kc-photo-btn kc-focus"
                    onClick={() => cameraInput.current?.click()}
                  >
                    <Camera size={18} aria-hidden="true" /> Take a photo
                  </button>
                </div>
                <input
                  ref={photoInput}
                  type="file"
                  accept={PHOTO_ACCEPT}
                  multiple
                  className="hidden"
                  aria-label="Choose property photos"
                  onChange={(event) => {
                    void addPhotos(event.target.files);
                    event.target.value = "";
                  }}
                />
                <input
                  ref={cameraInput}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  aria-label="Take a property photo"
                  onChange={(event) => {
                    void addPhotos(event.target.files);
                    event.target.value = "";
                  }}
                />
              </fieldset>
              <p className="col-span-2 -mt-2 text-xs leading-relaxed text-cream/65">
                Up to 5 JPG, PNG or WebP photos, 10 MB each. Camera capture is available on
                supported phones. Photos stay on your device until you send the request.
              </p>
              {processing && (
                <p role="status" className="col-span-2 text-sm text-lime">
                  Preparing photos…
                </p>
              )}
              {photos.length > 0 && (
                <ul className="col-span-2 grid grid-cols-3 gap-2" aria-label="Attached photos">
                  {photos.map((photo, index) => (
                    <li
                      key={photo.id}
                      className="relative overflow-hidden rounded-xl border border-cream/20"
                    >
                      <img
                        src={photo.url}
                        alt={`Property photo ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />
                      <button
                        type="button"
                        disabled={sending || processing}
                        className="kc-focus absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-forest-deep/95 text-cream"
                        aria-label={`Remove photo ${index + 1}`}
                        onClick={() => removePhoto(photo)}
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {photoError && (
                <p role="alert" className="col-span-2 text-sm text-amber-200">
                  {photoError}
                </p>
              )}
              <label className="col-span-2 flex items-start gap-2 text-xs leading-relaxed text-cream/75">
                <input
                  type="checkbox"
                  name="consent"
                  value="yes"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-lime"
                  disabled={sending}
                />
                <span>
                  KleanupCrew may contact me about this job and review the photos I attach.
                </span>
              </label>
              <div className="hidden" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              {config?.enabled && config.siteKey && (
                <div className="col-span-2">
                  <QuoteVerification
                    siteKey={config.siteKey}
                    attempt={attempt}
                    onToken={setToken}
                    onError={verificationError}
                  />
                </div>
              )}
              {!config?.enabled && (
                <p
                  role="status"
                  className="col-span-2 rounded-xl border border-cream/15 bg-cream/5 p-3 text-xs leading-relaxed text-cream/75"
                >
                  {config === null
                    ? "Checking request availability…"
                    : "Online requests are being set up. You can prepare your details and photos, but nothing will be sent yet."}
                </p>
              )}
              {error && (
                <p role="alert" className="col-span-2 text-sm text-amber-200">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="kc-btn col-span-2 min-h-11 justify-center disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  !config?.enabled || (!!config?.siteKey && !token) || sending || processing
                }
              >
                {sending ? "Sending request…" : "Request my estimate"}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
