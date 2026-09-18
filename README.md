# KleanupCrew Office View

## Current implementation

The local iterations include the supplied logo, “Clean. Clear. Care.” branding, expanded 3D controls, improved props, corrected shadows, and a direct quote dialog with Other, photo previews and camera capture. Delivery is disabled until the business inbox and server secrets are configured. See [quote delivery setup](docs/quote-delivery.md) before enabling submissions. `node --test tests/quotes.test.ts` exercises the delivery boundary using mocks; it sends no email.

## Original project brief

Build a polished, responsive one-page website for KleanupCrew.com, a local property-care and cleanup service marketplace. This is the initial foundation only, so create the complete working front end in one pass and do not add Supabase, authentication, payments, or a backend yet.

Visual concept: closely inspired by the interaction model and cinematic composition of https://living-operator.lexn8.chatgpt.site/ but do not copy its branding or assets. Create a full-viewport interactive 3D office/workroom using React + TypeScript + Vite, @react-three/fiber, @react-three/drei, and lightweight CSS. The 3D scene should be an inviting modern KleanupCrew operations office with NO PERSON sitting at the desk. Include a wood desk, empty chair, desktop monitor, keyboard, desk lamp, notebook/clipboard, coffee mug, large window, storage shelves, cleaning supplies, a small lawn mower/yard-care prop, a junk-removal dolly or boxes, a chainsaw/tree-care prop stored safely, and a clearly visible analog wall clock that displays the visitor's correct local time and updates live. Build the props from simple optimized 3D primitives so the project has no fragile external GLB dependency.

Style: premium, warm, slightly playful and game-like; forest green, fresh lime, warm cream, natural wood, and charcoal; soft daylight, realistic shadows, subtle ambient motion, tasteful depth of field only if performance allows. Use the temporary wordmark “KleanupCrew” with the tagline “Clean it. Clear it. Care for it.” until I provide a logo later.

Interaction: match the reference site's compact camera-angle rail on the left. Include six camera/view buttons: 01 Welcome, 02 Home Cleaning, 03 Lawn Care, 04 Junk Removal, 05 Tree & Yard, 06 Get a Quote. Each smoothly animates the camera to a relevant office prop or zone and updates a concise text panel. Support mouse drag for a small look-around effect and mouse wheel for a restrained zoom; do not use free orbit controls. Add a mute button for optional subtle ambient office/outdoor sound, but keep sound off by default. Use smooth authored transitions with GSAP if helpful.

Content: position KleanupCrew as “clean it, clear it, maintain it, improve the property.” Feature these service groups without crowding the hero: residential and commercial cleaning; standard/deep/recurring/move-in-move-out cleaning; rental turnovers; carpet, upholstery, window, gutter, and pressure washing; junk removal, bulk-item pickup, property/garage/estate cleanouts and non-hazardous renovation debris; lawn mowing, edging, trimming, leaf/yard cleanup, hedge and brush cleanup; tree trimming, pruning, removal and stump grinding through qualified providers; property prep, curb-appeal packages and recurring property care. Make “Make this property look good again” a featured request path where customers can describe a job and later upload photos.

UI: top-left brand lockup; top-right links Services, How It Works, For Providers, About plus a prominent “Get a Free Quote” button. Bottom-center glass panel should show the active service title, one sentence, and one clear CTA. Include a compact quote drawer/modal with name, email/phone placeholder, ZIP code, service selector, project description, and photo-upload placeholder UI only (no submission/backend). Add trust chips: Insured providers, Upfront estimates, Local crews. All controls need keyboard focus and accessible labels. Keep important copy in semantic DOM overlays rather than rendering text in WebGL.

Performance/responsiveness: one strong 3D hero scene, capped DPR, lazy-load noncritical elements, proper loading screen, respect prefers-reduced-motion, and create a simplified intentional mobile composition with the camera rail becoming a bottom swipeable tab bar. Do not use stock photos, gradients, excessive rounded cards, or excessive text. Ensure npm run build succeeds. Name the project “kleanupcrew-3d-office”.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/78736469-8a4f-469b-803f-09709b687e42).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
