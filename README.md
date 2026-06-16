# Smart Sleep Coach — Onboarding Prototype

An interactive, standalone rebuild of the Figma onboarding prototype. Pure
HTML/CSS/JS — no build step — deployable to Render as a Static Site.

The navigation flow (button clicks, screen transitions, option-selection
feedback) mirrors the original Figma prototype's reactions 1:1. Node IDs in
`public/screens.js` match the Figma node IDs.

## Flow

```
Intro ──► Age Q1 ─►(select)─► Age Q2 ─►(select)─► Age Q3 ─►(select)
   │                                                          │
   │ "Log in" link                                            ▼
   ▼                                              "600,000+ moms" (social proof)
Login ──(create account / log in)──► Intro                    │
                                                               ▼
   Goal Q ─►(select)─► Goal Q ─►(select)─► "We're glad you're here"
                                                               │
                                                               ▼
                          Goal Q ─►(select)─► Consultant hero ─► Quote (end)
```

Each question screen shows a ghost **Next** button that activates once an
option is selected (reproducing the Figma SMART_ANIMATE selected-state).
Back navigation is wired via the header arrow.

## Run locally

```bash
npm run preview        # python http.server on :8099
# or
npm start              # npx serve ./public
```

Then open http://localhost:8099 (preview) or the URL `serve` prints.

## Deploy to Render

This repo includes a `render.yaml` blueprint, so deployment is one click:

1. Push this repo to GitHub.
2. In Render: **New ► Blueprint**, select the repo. Render reads
   `render.yaml` and provisions a Static Site publishing `./public`.
3. Deploy. (Manual alternative: **New ► Static Site**, Build Command empty,
   Publish Directory `public`.)

`render.yaml` sets long-cache headers on `/assets/*`, no-cache on HTML, and a
SPA rewrite so any path resolves to the app.

## Fonts

The original uses licensed faces (Plantin MT Pro/Std, Mark Pro). This build
substitutes free Google Fonts — **Spectral** (serif display) and **Mulish**
(sans body) — to keep the deploy legal and self-contained.

To drop in the licensed originals, host the font files (e.g. in
`public/assets/fonts/`), add `@font-face` rules, and override the two
variables at the top of `public/styles.css`:

```css
:root {
  --font-display: 'Plantin MT Pro', serif;   /* headings */
  --font-body:    'Mark Pro', sans-serif;     /* body + buttons */
}
```

Layout, sizes, and spacing are font-metric-tolerant, so the swap won't shift
the design.

## Assets

`public/assets/` holds the real images exported from Figma (social-proof
photo, "we're glad" hero illustration, consultant photo, endorsement marks)
and the Pampers logo as SVG. The decorative gradient "lights" on hero screens
are reproduced in CSS (resolution-independent), not exported.

## Re-extracting from Figma

`extractor.js` (repo root) is the script used to pull frame data. Paste its
body into the figma-console `figma_execute` tool (Desktop Bridge connected) to
regenerate the compact spec for every frame on the page.
