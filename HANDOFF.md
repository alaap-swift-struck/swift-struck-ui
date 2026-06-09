# Swift Struck UI — handoff (read me first)

This is the single catch-up doc for a fresh chat. Read this, then
`ARCHITECTURE.md`, `GLIDE-PARITY.md`, and `PROGRESS.md`. Everything below is the
current state of the project as of this handoff.

## What Swift Struck UI is

A **web-first, cross-platform component & collection library** — inspired by
**shadcn/ui** (primitives) + **Glide** (data-bound, configurable collections) —
meant to be used as a **base to build entire apps** on web, then desktop
(Tauri) and mobile (Capacitor) by wrapping the **same web build**. No rewrite.

The user's north star: "everything I'll ever need to build an app on any
device," kept **lean, clean, and exhaustively documented**.

## Hard rules (the user cares a LOT about these)

1. **Anti-bloat.** A past project hit ~187k LOC for 10% done; never again.
   Prefer reuse, variants over new files, composition over duplication. Keep it
   small and well-organized. (See `memory/anti-bloat-mandate.md`.)
2. **Strict layering** (enforced): `tokens → primitives → collections`. Run
   `npm run guardrails` — it fails the build on illegal cross-layer or
   harness imports.
3. **Tokens are the only source of truth** — no hardcoded colors/sizes; use
   Tailwind utilities that resolve to `www/app/globals.css` `@theme`.
4. **Config: every field required, no optionals.** Each configurable component
   exports `XConfig` (all required) + `defaultXConfig` template. The user
   explicitly never wants a hidden/forgettable knob.
5. **Plain-English comments** on every file (a non-techie/dev/LLM can read it).

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · **Tailwind v4** (CSS-first
`@theme` tokens in `www/app/globals.css`) · Radix UI · CVA · cmdk ·
**tw-animate-css** · **recharts** (charts) · next-themes · lucide-react (v1) ·
sonner (toasts) · dependency-cruiser (layering). No CSS-in-JS.

## Repo map

> **Naming:** the public package is **`@swift-struck/ui`**; "Swift Struck UI" is the old
> internal codename still used across these docs (mass-rename is optional).
>
> The repo **is** the library: the package `@swift-struck/ui` lives at the root, so
> apps install it straight from GitHub. The showcase site lives in `www/`.

```
(repo root = THE LIBRARY, package name "@swift-struck/ui" — what GitHub-install gives)
package.json              the library: deps, exports (./registry/*, ./lib/*), files
lib/utils.ts              cn()
lib/config.ts             CONFIG SYSTEM: rule engine + BaseConfig + mixins + validateField
registry/tokens/          theme-provider
registry/primitives/<name>/<name>.tsx    layer-1 atoms
registry/collections/<name>/<name>.tsx   layer-2 data views (incl. collection-frame)
registry.json             manifest of every component
README.md                 package + repo front-door (install from GitHub)
www/                      Next.js DOCS/SHOWCASE site (the gallery; NOT shipped)
  package.json            the app; pulls the library via @swift-struck/ui/* tsconfig paths
  next.config.ts          externalDir:true (compiles the root library as source)
  app/globals.css         Layer-0 tokens + @source ../../registry (scans the library)
  app/page.tsx            Dashboard demo (the "/" face)
  app/components/page.tsx The GALLERY — 7 Glide-style sections, a ⚙ per card
  app/components/_playground/ config-editor.tsx (harness-only live editor)
DEPLOY.md                 staging/live plan + YOUR account checklist
LICENSE                   MIT
.github/workflows/ci.yml  CI: tsc + tests + guardrails + format on every push
ARCHITECTURE · CONTRIBUTING · GLIDE-PARITY · GLIDE-CONFIG-RESEARCH · PROGRESS  (.md)
.dependency-cruiser.cjs   enforced layering (on root registry/ + lib/ paths)
```

Apps consume the library via `@swift-struck/ui/registry/*` + `@swift-struck/ui/lib/*`
(the showcase app does exactly this). Library-internal imports are relative.

## Key decisions made (don't relitigate without the user)

- **Cross-platform = web-first, wrapped natively** (Tauri desktop, Capacitor
  mobile).
- **Distribution = install straight from GitHub** (one place, no npm account) — DONE.
  The library IS the repo root, so `npm install github:alaap-swift-struck/swift-struck-ui`
  delivers it; apps re-run install to pull updates. GitHub = read + install; the
  live docs site = understand. Chosen GitHub-only over npm publish per the user's
  "one organized place" preference. Hosting = Cloudflare Pages (live + staging URLs;
  same build, only the URL differs — I deploy via wrangler, no GitHub needed for it).
- **Config model (shipped):** `BaseConfig` (visible + visibilityRules) on every
  component, then category mixins (`FieldConfig`, `ActionConfig`,
  `CollectionConfig`, `ContentConfig`), then per-component knobs. All in
  `lib/config.ts`. Components self-hide via `useIsVisible` (registry/primitives/
  visibility).
- **Visibility / data-filter rule engine (shipped):** one `Rule` shape
  (source row/user/app · field · op · value, AND/OR). Collection `filter`/`sort`
  is DECLARED in config, to be EXECUTED by a future **D1/SQL data layer**.
- **Component taxonomy** (orthogonal to layers): Input / Content / Action /
  Collection / Navigation / Overlay / Layout. See ARCHITECTURE.md.
- **Design language:** Teal brand + Amber chart accent, Inter font, **frosted
  glass** surfaces (the heavier "liquid-glass gloss" was tried and REJECTED —
  keep it frosted/subtle), `hover-lift`, ambient interactive gradient bg,
  entrance animations, animated teal **required-ring**, min text size bumped
  (xs 13 / sm 15). Reactivity/"aliveness" on hover/tap everywhere.

## How to run & verify

- **Dev server:** `npm run dev` (or the Claude preview tool) → http://localhost:3000
  (dashboard) and `/components` (gallery). It **sleeps between sessions** — if
  the browser says "localhost refused to connect," just start it again.
- **Verify (ALWAYS do this before committing):**
  `npm run format && npx tsc --noEmit && npm run guardrails`
- **⚠️ Do NOT run `npm run build` (next build) while the dev server is running**
  — they share `.next` and it corrupts the dev server's CSS (page renders
  unstyled). Use `tsc --noEmit` + guardrails to verify instead.
- Commits: end messages with the Co-Authored-By trailer; commit on `main`
  (solo greenfield repo, user is fine with it).

## Current status

- ~**68 components**, Glide-palette parity **complete** (only `Contact` and
  intentionally-skipped niche items remain; see GLIDE-PARITY.md).
- **Inputs pass DONE:** `Field` wrapper (label + animated required-ring +
  helpText + `validateField`); Signature fixed (dot-on-tap, pointer capture,
  ring hugs just the canvas); `rich-text` renamed → `notes` (highlight / ordered
  list / separator); Skeleton variants (text/card/media/list).
- **Glide-parity gallery revamp DONE** (the big one): the gallery (`/components`)
  is regrouped to mirror Glide — **Collections · Display · Inputs & Pickers ·
  Actions · Layout · Navigation · Overlays**. Fields (detail-view) & Big Numbers
  (stat-grid) live under Display (single-record Components, not Collections).
- **Every demo card is one configuration with its own ⚙** (53 live editors),
  driven by a keyed knob store + `VariantGroup` helper (no per-card state hooks).
- **`collection-frame`** = one shared chrome for every collection: title + live
  "Showing X of Y" count (reacts to search) + search + pagination (`itemsPerPage`)
  - total `limit`. Powers List & Card (seeded with 36 rows). Card collection added.
- **`GLIDE-CONFIG-RESEARCH.md`** = per-component Glide config reference (the
  source of truth for ongoing field-by-field parity).
- **Reviewed & hardened:** responsive verified at 390/768/1440 (no overflow on
  gallery or dashboard); no-overflow rule (`min-w-0` + truncate) enforced;
  validateField guards numeric coercion; dead code removed; tsc + guardrails green.

## Outstanding / recommended next (user's priority order-ish)

1. **Deeper per-component config parity** — wire the real Glide knobs field-by-
   field from `GLIDE-CONFIG-RESEARCH.md` (e.g. Entry `size`/multiline as a typed
   config, Title style enum, Choice `radio` style, Container backgrounds). Today
   many primitives have a ⚙ over their visual props; not every Glide field yet.
2. **A few demos are still showcase-only** (no ⚙): Breadcrumb, the Pagination
   sample, Command palette — add configs if desired.
3. **Cloudflare staging deploy** (needs build config + Wrangler/Pages setup).
4. **Visual rule-builder** in the playground (rules editable as JSON today).
5. **Adopt remaining category mixins** (ActionConfig triggers; CollectionConfig
   filter executed by a data layer). `ActionConfig`/`ContentConfig` exist in
   `lib/config.ts` but are not consumed yet (kept as documented foundation).
6. **DataTable**: column filters + its own pagination (base table done; the
   gallery table scrolls horizontally on mobile).
7. **Workspace-package restructure**; then **per-component `.mdx` docs**; later
   **native shells** (Tauri + Capacitor).

## Working style the user likes

- Show work in the live preview / screenshots; they give visual feedback.
- Offer decisions as **MCQ** (AskUserQuestion) — they explicitly prefer it.
- Be decisive and propose architecture; confirm big forks before large refactors.
- They move fast and give dense, multi-point feedback — parse it into a list.
