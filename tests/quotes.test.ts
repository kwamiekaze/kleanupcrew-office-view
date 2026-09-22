import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cleanJpeg, handleQuoteRequest, type QuoteEnv } from "../src/server/quotes.ts";

const env: QuoteEnv = {
  QUOTE_DELIVERY_ENABLED: "true",
  QUOTE_TO_EMAIL: "crew@example.invalid",
  QUOTE_FROM_EMAIL: "website@example.invalid",
  QUOTE_SITE_ORIGIN: "https://example.invalid",
  RESEND_API_KEY: "test-only",
  TURNSTILE_SITE_KEY: "test-only",
  TURNSTILE_SECRET_KEY: "test-only",
};
const photo = new Uint8Array(
  readFileSync(new URL("../public/brand/kleanupcrew-logo.jpg", import.meta.url)),
);
function form() {
  const data = new FormData();
  Object.entries({
    name: "Test customer",
    contact: "customer@example.invalid",
    zip: "12345",
    service: "Other",
    description: "Please help with this unlisted property service.",
    token: "test-token",
    consent: "yes",
    requestId: "12345678-1234-4123-8123-123456789012",
  }).forEach(([key, value]) => data.set(key, value));
  return data;
}
function request(data = form(), origin = "https://example.invalid") {
  return new Request("https://example.invalid/api/quotes", {
    method: "POST",
    headers: { Origin: origin },
    body: data,
  });
}
const noNetwork: typeof fetch = async () => {
  throw new Error("Unexpected external call");
};
function transport(success = true, emailStatus = 200) {
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  const fake: typeof fetch = async (url, options) => {
    calls.push({ url: String(url), body: JSON.parse(String(options?.body)) });
    return String(url).includes("siteverify")
      ? Response.json({ success, hostname: "example.invalid", action: "quote" })
      : Response.json(
          emailStatus === 200 ? { id: "test-accepted-id" } : { error: "test failure" },
          { status: emailStatus },
        );
  };
  return { fake, calls };
}

test("delivery is disabled by default and does not expose secrets", async () => {
  const result = await handleQuoteRequest(
    new Request("https://example.invalid/api/quotes"),
    {},
    noNetwork,
  );
  assert.deepEqual(await result.json(), { enabled: false, siteKey: null });
  assert.equal((await handleQuoteRequest(request(), {}, noNetwork)).status, 503);
});
test("every required configuration value is needed", async () => {
  for (const key of Object.keys(env) as Array<keyof QuoteEnv>) {
    const partial = { ...env };
    delete partial[key];
    assert.equal((await handleQuoteRequest(request(), partial, noNetwork)).status, 503, key);
  }
});
test("configuration exposes only readiness and public site key", async () => {
  const result = await handleQuoteRequest(
    new Request("https://example.invalid/api/quotes"),
    env,
    noNetwork,
  );
  assert.deepEqual(await result.json(), { enabled: true, siteKey: "test-only" });
  assert.equal(result.headers.get("cache-control"), "no-store");
});
test("rejects cross-origin requests before processing attachments", async () => {
  assert.equal(
    (await handleQuoteRequest(request(form(), "https://untrusted.invalid"), env, noNetwork)).status,
    403,
  );
});
test("requires supported services, contact, description and consent", async () => {
  for (const [key, value] of [
    ["service", "Unsupported"],
    ["contact", "not a contact"],
    ["description", "short"],
    ["zip", "abcde"],
    ["consent", ""],
    ["website", "spam.invalid"],
  ]) {
    const data = form();
    data.set(key!, value!);
    assert.equal((await handleQuoteRequest(request(data), env, noNetwork)).status, 400, key);
  }
});
test("rejects SVG and excessive photo counts", async () => {
  const svg = form();
  svg.append(
    "photos",
    new File(["<svg>untrusted</svg>"], "picture.svg", { type: "image/svg+xml" }),
  );
  assert.equal((await handleQuoteRequest(request(svg), env, noNetwork)).status, 400);
  const many = form();
  for (let i = 0; i < 6; i++)
    many.append("photos", new File([photo], "photo.jpg", { type: "image/jpeg" }));
  assert.equal((await handleQuoteRequest(request(many), env, noNetwork)).status, 400);
});
test("rejects body sizes beyond the hard limit", async () => {
  const req = request();
  req.headers.set("content-length", String(9 * 1024 * 1024));
  assert.equal((await handleQuoteRequest(req, env, noNetwork)).status, 413);
});
test("failed spam verification never sends email", async () => {
  const mock = transport(false);
  assert.equal((await handleQuoteRequest(request(), env, mock.fake)).status, 403);
  assert.equal(mock.calls.length, 1);
});
test("verifies the challenge hostname and action", async () => {
  const fake: typeof fetch = async () =>
    Response.json({ success: true, hostname: "untrusted.invalid", action: "other-form" });
  assert.equal((await handleQuoteRequest(request(), env, fake)).status, 403);
});
test("Other sends job details and safe attachments only to configured address", async () => {
  const data = form();
  data.append("photos", new File([photo], "private-original-name.jpg", { type: "image/jpeg" }));
  data.set("to", "attacker@example.invalid");
  const mock = transport();
  const result = await handleQuoteRequest(request(data), env, mock.fake);
  assert.deepEqual(await result.json(), { ok: true });
  const body = mock.calls[1]!.body;
  assert.deepEqual(body["to"], [env.QUOTE_TO_EMAIL]);
  assert.equal(body["reply_to"], "customer@example.invalid");
  assert.match(String(body["text"]), /unlisted property service/);
  const attachment = (body["attachments"] as Array<{ filename: string; content: string }>)[0]!;
  assert.equal(attachment.filename, "property-photo-1.jpg");
  assert.ok(Buffer.from(attachment.content, "base64").length > 100);
});
test("delivers every request to all configured recipients", async () => {
  const multi: QuoteEnv = {
    ...env,
    QUOTE_TO_EMAIL: "kleanup365@example.invalid, kwamiekaze@example.invalid",
  };
  const mock = transport();
  const result = await handleQuoteRequest(request(), multi, mock.fake);
  assert.deepEqual(await result.json(), { ok: true });
  assert.deepEqual(mock.calls[1]!.body["to"], [
    "kleanup365@example.invalid",
    "kwamiekaze@example.invalid",
  ]);
});
test("de-duplicates recipients and ignores malformed entries", async () => {
  const messy: QuoteEnv = {
    ...env,
    QUOTE_TO_EMAIL: "kleanup365@example.invalid, not-an-email, KLEANUP365@example.invalid",
  };
  const mock = transport();
  const result = await handleQuoteRequest(request(), messy, mock.fake);
  assert.deepEqual(await result.json(), { ok: true });
  assert.deepEqual(mock.calls[1]!.body["to"], ["kleanup365@example.invalid"]);
});
test("stays disabled when no valid recipient is configured", async () => {
  const broken: QuoteEnv = { ...env, QUOTE_TO_EMAIL: "not-an-email" };
  assert.equal((await handleQuoteRequest(request(), broken, noNetwork)).status, 503);
});
test("email failures do not return a false success", async () => {
  const mock = transport(true, 503);
  const result = await handleQuoteRequest(request(), env, mock.fake);
  assert.equal(result.status, 502);
  assert.equal((await result.json()).ok, undefined);
});
test("rejects fake JPEG content even with an image MIME type", async () => {
  const data = form();
  data.append(
    "photos",
    new File(["not a photo even though it says JPEG"], "fake.jpg", { type: "image/jpeg" }),
  );
  const mock = transport();
  assert.equal((await handleQuoteRequest(request(data), env, mock.fake)).status, 400);
  assert.equal(mock.calls.length, 1);
});
test("JPEG sanitizing removes EXIF, comments and trailing payloads", () => {
  const privateData = new TextEncoder().encode("GPS-private-data");
  const segment = new Uint8Array([0xff, 0xe1, 0, privateData.length + 2, ...privateData]);
  const injected = new Uint8Array([
    ...photo.subarray(0, 2),
    ...segment,
    ...photo.subarray(2),
    ...privateData,
  ]);
  const cleaned = cleanJpeg(injected);
  assert.deepEqual(cleaned, cleanJpeg(photo));
  assert.equal(new TextDecoder().decode(cleaned).includes("GPS-private-data"), false);
  assert.throws(() => cleanJpeg(photo.subarray(0, 20)));
});
