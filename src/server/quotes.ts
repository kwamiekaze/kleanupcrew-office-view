import { SERVICE_OPTIONS } from "../lib/kleanup-content.ts";
import { MAX_PHOTOS, MAX_ATTACHMENT_BYTES } from "../lib/quote-photos.ts";

export type QuoteEnv = Partial<
  Record<
    | "QUOTE_DELIVERY_ENABLED"
    | "QUOTE_TO_EMAIL"
    | "QUOTE_FROM_EMAIL"
    | "QUOTE_SITE_ORIGIN"
    | "RESEND_API_KEY"
    | "TURNSTILE_SITE_KEY"
    | "TURNSTILE_SECRET_KEY",
    string
  >
>;

const MAX_BODY_BYTES = 8 * 1024 * 1024;
const EMAIL = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
export const QUOTE_RECIPIENTS = ["kwamiekaze@gmail.com", "kleanup365@gmail.com"] as const;
const MAX_RECIPIENTS = 20;
const UNAVAILABLE =
  "Online requests are not available yet. Your details and photos have not been sent.";

/**
 * The two owner inboxes are mandatory recipients. QUOTE_TO_EMAIL may add more
 * addresses, separated by commas or spaces. The final list is validated,
 * de-duplicated case-insensitively, and capped so a misconfigured value cannot
 * fan a single request out to an unbounded set of addresses.
 */
function recipients(env: QuoteEnv): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  const configured = [QUOTE_RECIPIENTS.join(","), env.QUOTE_TO_EMAIL ?? ""].join(",");
  for (const part of configured.split(/[\s,]+/)) {
    const address = part.trim();
    if (!EMAIL.test(address)) continue;
    const key = address.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(address);
    if (list.length >= MAX_RECIPIENTS) break;
  }
  return list;
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

function ready(env: QuoteEnv) {
  try {
    const origin = new URL(env.QUOTE_SITE_ORIGIN ?? "");
    return (
      env.QUOTE_DELIVERY_ENABLED === "true" &&
      EMAIL.test(env.QUOTE_FROM_EMAIL ?? "") &&
      Boolean(env.RESEND_API_KEY) &&
      origin.protocol === "https:" &&
      origin.origin === env.QUOTE_SITE_ORIGIN
    );
  } catch {
    return false;
  }
}

/**
 * The Turnstile challenge is used when both of its keys are present, and
 * skipped when they are not. Delivery works either way: without Turnstile the
 * form still runs behind the same-origin check and the honeypot field, so
 * requests can be sent as soon as the email settings are in place, and the
 * stronger bot check can be switched on later just by adding the two keys.
 */
function turnstileConfigured(env: QuoteEnv) {
  return Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
}

async function limitedForm(request: Request): Promise<FormData> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing request");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("Request too large");
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new Response(bytes, {
    headers: { "Content-Type": request.headers.get("content-type") ?? "" },
  }).formData();
}

function field(form: FormData, key: string, min: number, max: number) {
  const raw = form.get(key);
  if (typeof raw !== "string") throw new Error(`Please check ${key}.`);
  const value = raw.trim();
  const hasDisallowedControl = Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
  });
  if (value.length < min || value.length > max || hasDisallowedControl) {
    throw new Error(`Please check ${key}.`);
  }
  return value;
}

function base64(bytes: Uint8Array) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }
  return btoa(binary);
}

/** Only allow JPEG structure; strip EXIF, comments and appended payloads server-side. */
export function cleanJpeg(bytes: Uint8Array): Uint8Array {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error("Invalid photo");
  const parts = [bytes.subarray(0, 2)];
  let offset = 2;
  let hasDimensions = false;
  let hasScan = false;
  while (offset < bytes.length) {
    const start = offset;
    if (bytes[offset++] !== 0xff) throw new Error("Invalid photo");
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xd9) {
      if (!hasDimensions || !hasScan) throw new Error("Invalid photo");
      parts.push(new Uint8Array([0xff, 0xd9]));
      const result = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
      let cursor = 0;
      for (const part of parts) {
        result.set(part, cursor);
        cursor += part.length;
      }
      return result;
    }
    if (
      marker === undefined ||
      marker === 0x00 ||
      marker === 0xd8 ||
      (marker >= 0xd0 && marker <= 0xd7)
    )
      throw new Error("Invalid photo");
    const length = ((bytes[offset] ?? 0) << 8) | (bytes[offset + 1] ?? 0);
    const end = offset + length;
    if (length < 2 || end > bytes.length) throw new Error("Invalid photo");
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const height = ((bytes[offset + 3] ?? 0) << 8) | (bytes[offset + 4] ?? 0);
      const width = ((bytes[offset + 5] ?? 0) << 8) | (bytes[offset + 6] ?? 0);
      if (length < 8 || !width || !height || width > 1600 || height > 1600)
        throw new Error("Invalid photo dimensions");
      hasDimensions = true;
    }
    // APP0 is JPEG/JFIF metadata; other APP segments and comments may contain private data.
    if (!(marker >= 0xe1 && marker <= 0xef) && marker !== 0xfe)
      parts.push(bytes.subarray(start, end));
    offset = end;
    if (marker === 0xda) {
      hasScan = true;
      const scanStart = offset;
      while (offset < bytes.length) {
        if (bytes[offset] === 0xff) {
          const next = bytes[offset + 1];
          if (next === 0x00 || (next !== undefined && next >= 0xd0 && next <= 0xd7)) {
            offset += 2;
            continue;
          }
          break;
        }
        offset++;
      }
      parts.push(bytes.subarray(scanStart, offset));
    }
  }
  throw new Error("Incomplete photo");
}

export async function handleQuoteRequest(
  request: Request,
  env: QuoteEnv,
  transport: typeof fetch = fetch,
): Promise<Response> {
  if (request.method === "GET") {
    const enabled = ready(env);
    return json({
      enabled,
      siteKey: enabled && turnstileConfigured(env) ? env.TURNSTILE_SITE_KEY : null,
    });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!ready(env)) return json({ error: UNAVAILABLE }, 503);
  if (
    request.headers.get("origin") !== env.QUOTE_SITE_ORIGIN ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return json({ error: "Please submit the form from our website." }, 403);
  }
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;"))
    return json({ error: "Invalid request format." }, 415);
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    return json({ error: "Please attach fewer or smaller photos." }, 413);

  let form: FormData;
  try {
    form = await limitedForm(request);
  } catch {
    return json(
      { error: "The request could not be read. Please attach fewer or smaller photos." },
      400,
    );
  }

  let details: {
    name: string;
    contact: string;
    zip: string;
    service: string;
    description: string;
    token: string;
    requestId: string;
  };
  let files: File[];
  try {
    if (form.get("website")) throw new Error("Please try again.");
    details = {
      name: field(form, "name", 2, 100),
      contact: field(form, "contact", 6, 160),
      zip: field(form, "zip", 5, 10),
      service: field(form, "service", 2, 100),
      description: field(form, "description", 10, 3000),
      token: turnstileConfigured(env) ? field(form, "token", 1, 2048) : "",
      requestId: field(form, "requestId", 36, 36),
    };
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        details.requestId,
      )
    )
      throw new Error("Please reopen the form and try again.");
    if (!/^\d{5}(-\d{4})?$/.test(details.zip)) throw new Error("Enter a valid ZIP code.");
    if (!EMAIL.test(details.contact) && !/^[+()\d\s.-]{7,30}$/.test(details.contact))
      throw new Error("Enter an email address or phone number.");
    if (!SERVICE_OPTIONS.includes(details.service))
      throw new Error("Select a service, or choose Other.");
    if (form.get("consent") !== "yes")
      throw new Error("Please confirm that we may contact you about the quote.");
    const entries = form.getAll("photos");
    if (entries.length > MAX_PHOTOS) throw new Error("Attach up to five photos.");
    files = entries.map((file) => {
      if (
        typeof file === "string" ||
        file.type !== "image/jpeg" ||
        file.size < 16 ||
        file.size > MAX_ATTACHMENT_BYTES
      )
        throw new Error("Please reselect your photos using the upload buttons.");
      return file;
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Please check your details." },
      400,
    );
  }

  try {
    if (turnstileConfigured(env)) {
      const verification = await transport(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: details.token }),
        },
      );
      const check = (await verification.json()) as {
        success?: boolean;
        hostname?: string;
        action?: string;
      };
      if (
        !verification.ok ||
        !check.success ||
        check.hostname !== new URL(env.QUOTE_SITE_ORIGIN!).hostname ||
        check.action !== "quote"
      ) {
        return json(
          { error: "Verification expired or failed. Please complete the check and try again." },
          403,
        );
      }
    }
    const attachments: { filename: string; content: string; content_type: string }[] = [];
    for (const [index, file] of files.entries()) {
      let clean: Uint8Array;
      try {
        clean = cleanJpeg(new Uint8Array(await file.arrayBuffer()));
      } catch {
        return json(
          { error: "A photo could not be verified. Remove it and select it again." },
          400,
        );
      }
      attachments.push({
        filename: `property-photo-${index + 1}.jpg`,
        content: base64(clean),
        content_type: "image/jpeg",
      });
    }
    const sent = await transport("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(20000),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `quote-${details.requestId}`,
      },
      body: JSON.stringify({
        from: `KleanupCrew Website <${env.QUOTE_FROM_EMAIL}>`,
        to: recipients(env),
        ...(EMAIL.test(details.contact) ? { reply_to: details.contact } : {}),
        subject: `Quote request: ${details.service}`,
        text: [
          "New KleanupCrew quote request",
          `Name: ${details.name}`,
          `Contact: ${details.contact}`,
          `ZIP: ${details.zip}`,
          `Service: ${details.service}`,
          "",
          details.description,
          "",
          `Photos attached: ${attachments.length}`,
          "Customer agreed to be contacted about this request.",
        ].join("\n"),
        attachments,
      }),
    });
    if (!sent.ok)
      return json(
        {
          error:
            "We could not send your request. Your details are still here so you can try again.",
        },
        502,
      );
    const accepted = (await sent.json()) as { id?: string };
    if (!accepted.id) return json({ error: "Delivery was not confirmed. Please try again." }, 502);
    return json({ ok: true });
  } catch {
    return json(
      { error: "The connection timed out. Your details are still here; please try again." },
      502,
    );
  }
}
