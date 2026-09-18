# Quote delivery setup

The form supports Other, a job description, up to five local photo previews, removal, and a camera picker on supported phones. No photos leave the browser until the customer submits. The current deployment is intentionally disabled until the business supplies its email settings.

## Activate in the hosting environment

Use the server runtime's secrets/environment settings (Lovable/Cloudflare), never client code or `VITE_` variables:

| Setting | Value |
| --- | --- |
| QUOTE_TO_EMAIL | Business inbox supplied by the owner |
| QUOTE_FROM_EMAIL | A sender address on a domain verified in Resend |
| QUOTE_SITE_ORIGIN | Exact HTTPS origin of the deployed site, with no trailing slash |
| RESEND_API_KEY | Resend sending key restricted to the verified domain |
| TURNSTILE_SITE_KEY | Public key for a Turnstile widget restricted to that hostname |
| TURNSTILE_SECRET_KEY | Corresponding private key |
| QUOTE_DELIVERY_ENABLED | Set to true only after the other settings are ready |

`GET /api/quotes` returns only readiness and the public widget key. `POST /api/quotes` fails closed if anything is unconfigured. The server reads deployment bindings when provided, then runtime environment values. Deployments must include the server output; a static-only export cannot deliver requests.

The implementation uses the [Resend email API](https://resend.com/docs/api-reference/emails/send-email) and [server-validated Turnstile challenges](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). It checks origin, challenge hostname/action, field lengths, consent, attachment count/type/size and JPEG structure. Photos are resized and encoded in the browser; server-side sanitizing removes EXIF/comment metadata and appended bytes. Fixed generated filenames are used. There are no public upload URLs, permanent photo storage or request-body logs. Resend processes the email and its attachments; this is HTTPS transport, not end-to-end encrypted email.

The upload limit is 10 MB per source photo, 1600 pixels after resizing, 1.5 MB per normalized attachment, five photos, and 8 MB total request data. HEIC files must be exported as JPG; camera capture depends on browser/device support. Nothing is silently accepted as sent: only provider acceptance produces the success state. The form keeps drafts in memory after failures and uses an idempotency key when retrying unchanged content.

## Verification before enabling delivery

1. Run `node --test tests/quotes.test.ts`, `npx tsc --noEmit`, and `npm run build`.
2. Verify the public status endpoint is enabled on the final hostname, and the challenge loads.
3. Submit one authorized test using Other with a photo, confirm receipt and attachment in the business inbox, and verify Reply goes to the customer when an email was given.
4. Test the camera picker on a physical iPhone and Android. Desktop emulation cannot verify native camera capture.
5. Apply deployment-level rate limits to POST `/api/quotes` before public launch, and confirm mailbox/email-provider retention matches business policy.

No live email or device camera test has been performed while the configuration is missing.
