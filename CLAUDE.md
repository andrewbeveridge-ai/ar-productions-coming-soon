# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The "Coming Soon" marketing site for **Another Realm Productions** (anotherrealmproductions.com) — an AI-music production brand. It is a **static site with no build step, no framework, and no package manifest**. Pages are hand-authored HTML with all CSS and JavaScript inlined directly in each `.html` file. Deployment is Netlify, serving the repository root as-is.

## Commands

- **Run locally:** open the `.html` files directly in a browser, or serve the root with any static server (e.g. `python3 -m http.server`). There is no dev server, bundler, or watch task.
- **Build / lint / test:** none exist. Do not invent them.
- **Regenerate the Open Graph image** (only after the article's title/branding changes): `node scripts/generate-og.js`. This requires `sharp` (not declared in any manifest — install ad hoc with `npm install sharp`). It rasterizes an inline SVG to `og/ai-music-labels-control.png` (1200×630), which is **committed as a static asset**.

## Deployment (Netlify)

- `netlify.toml` publishes the repo root (`publish = "."`) and sets `X-Frame-Options: DENY` on all routes. There is no build command.
- Netlify serves clean URLs: `services.html` → `/services`, `insights/ai-music-labels-control.html` → `/insights/ai-music-labels-control`. All canonical/`og:url` tags use the extension-less form, so keep file names aligned with the URLs referenced in metadata.
- Pushing to the deployed branch triggers a Netlify deploy. There is no staging/CI gate in the repo.

## Page architecture

Each page is **fully self-contained** — `<style>` and `<script>` live inline in the HTML; there is no shared JS or CSS bundle. The one shared stylesheet is `insights/article.css`, used only by articles under `insights/`.

- `index.html` — the coming-soon landing page. Most of its weight is a self-contained animated canvas star field plus a CSS/JS "orbital" logo animation (rings that orbit and return on a timed cycle). Treat the animation code as a single cohesive system.
- `services.html` — services page; shares the same visual language and the star-field canvas, minus the orbital animation.
- `insights/ai-music-labels-control.html` — a long-form article; the template for future `insights/` articles. Pulls styling from `insights/article.css` and references a pre-rendered `og/*.png` social image.

### Shared design conventions

Replicate these exactly when adding or editing pages so the brand stays consistent:

- **Color tokens** (defined as CSS custom properties in every page's `:root`): `--gold:#D4AF37`, `--silver:#B8B8B8`, `--black:#0A0A0A`, `--white:#FAFAFA`. The same gold (`#D4AF37`) is hard-coded in `scripts/generate-og.js`.
- **Fonts** are loaded from Google Fonts: `Rajdhani` (body/UI), `Cormorant Garamond` (display serif), `DM Mono` (mono). Use the same `<link rel="preconnect">` + stylesheet pattern.
- Every page sets `theme-color` `#0A0A0A`, `viewport-fit=cover`, and uses `100dvh`/`safe-area-inset` padding for mobile.
- Each page carries its own SEO/social `<meta>` block (`og:*`, and `twitter:*` for articles) and `<link rel="canonical">`. Update these when copying a page.

## Lead capture (Supabase edge function)

Both `index.html` and `services.html` post the lead form to a Supabase Edge Function:

- Endpoint: `https://bgswqjgswlvdazseyhvu.supabase.co/functions/v1/capture-lead` (the `LEAD_ENDPOINT` constant, duplicated in each page's inline `submitLead`).
- Payload contract — **follow it precisely**:
  - Always sent: `entity:'ARAI'`, `dba:'Another Realm Productions'`, `source`, `email`, `_hp` (honeypot anti-spam field).
  - `source` identifies the page: `'web:home'` (index) / `'web:services'` (services). Use a new `'web:<page>'` value for new pages.
  - Optional fields (`name`, `phone`, `notes`) are included **only when non-empty** — never send `""`. Note the form field `comment` maps to the payload key `notes`.
- Success is `r.ok && json.ok === true`; on success the form is hidden and `#successMsg` shown. Keep this contract identical across pages — if you change the form on one page, mirror it on the other.

## Conventions when editing

- Keep CSS/JS inline per page (don't extract to shared files except the existing `insights/article.css`); match the existing minified-ish, semicolon-dense inline `<script>` style.
- The lead-capture logic is intentionally duplicated across pages — if you touch it, update every page that has it.
- `.gitignore` excludes only `node_modules/`. The generated OG PNG and all favicons are committed assets, not build outputs.
