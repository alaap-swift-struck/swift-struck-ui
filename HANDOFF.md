# brimba — handoff (read me first)

This is the single catch-up doc for a fresh chat. Read this, then
`ARCHITECTURE.md`, `GLIDE-PARITY.md`, and `PROGRESS.md`. Everything below is the
current state of the project as of this handoff.

## What brimba is

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
   Tailwind utilities that resolve to `app/globals.css` `@theme`.
4. **Config: every field required, no optionals.** Each configurable component
   exports `XConfig` (all required) + `defaultXConfig` template. The user
   explicitly never wants a hidden/forgettable knob.
5. **Plain-English comments** on every file (a non-techie/dev/LLM can read it).

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · **Tailwind v4** (CSS-first
`@theme` tokens in `app/globals.css`) · Radix UI · CVA · cmdk ·
**tw-animate-css** · **recharts** (charts) · next-themes · lucide-react (v1) ·
sonner (toasts) · dependency-cruiser (layering). No CSS-in-JS.

## Repo map

```
app/                      Next.js DOCS/SHOWCASE harness (not shipped)
  globals.css             Layer-0 tokens + motion/glass/required-ring utilities
  page.tsx                Dashboard demo (the "/" face — chart, stats, list…)
  components/page.tsx     The component GALLERY (searchable, ⚙ live-config gears)
  components/_playground/ config-editor.tsx (harness-only live config+data editor)
  preview/                TEMPORARY design mockups — deletable
lib/
  utils.ts                cn()
  config.ts               CONFIG SYSTEM: Rule engine + BaseConfig + category configs
registry/                 THE LIBRARY (the shippable source)
  tokens/                 theme-provider
  primitives/<name>/<name>.tsx     layer-1 atoms (~45)
  collections/<name>/<name>.tsx    layer-2 data views (~15)
registry.json             manifest of every component
ARCHITECTURE.md           the contract (layers, taxonomy, config model, rules)
CONTRIBUTING.md           how to add a component
GLIDE-PARITY.md           every Glide palette item → brimba status
PROGRESS.md               running built/to-build tally
.dependency-cruiser.cjs   enforced layering rules
```

## Key decisions made (don't relitigate without the user)

- **Cross-platform = web-first, wrapped natively** (Tauri desktop, Capacitor
  mobile).
- **Distribution = workspace package** (apps import brimba; a central fix
  propagates everywhere; per-app config stays). **Restructure is PENDING** —
  components are isolated in `registry/`, so it's plumbing-only.
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

- ~**66 components**, Glide-palette parity **essentially complete** (only
  `Contact` — a trivial action-row+avatar composition — and intentionally
  skipped niche items remain; see GLIDE-PARITY.md).
- The **config foundation** (BaseConfig + visibility rule engine) is rolled into
  all 9 configurable components; the playground gear shows `visible` +
  `visibilityRules` on each (toggle to live-hide).
- The **playground**: every configurable demo has a ⚙ gear that live-edits its
  **config AND its data** (JSON); the gallery has search.

## Outstanding / recommended next (user's priority order-ish)

1. **Inputs pass** (recommended next): adopt `FieldConfig` on input components —
   number `min/max`, text `min/max length`, `required` ring everywhere; **fix
   the Signature component** (drawing/tap is currently buggy); ship a real
   **Notes** editor (rename `rich-text` → notes; add highlight, ordered list,
   separator; support required); add **Skeleton variants** (text/card/media/list).
2. **Visual rule-builder** in the playground (rules are editable as JSON today;
   build a source→field→op→value UI).
3. **Adopt category mixins** on the remaining components (ActionConfig triggers
   on actions; CollectionConfig filter wired to data).
4. **DataTable**: column filters + pagination (base table done).
5. **Workspace-package restructure** (locks in propagation; lets the user run
   `npm run dev` themselves independently).
6. **Per-component `.mdx` docs** (deferred until the look was locked — it is now).
7. Later: **native shells** (Tauri + Capacitor).

## Working style the user likes

- Show work in the live preview / screenshots; they give visual feedback.
- Offer decisions as **MCQ** (AskUserQuestion) — they explicitly prefer it.
- Be decisive and propose architecture; confirm big forks before large refactors.
- They move fast and give dense, multi-point feedback — parse it into a list.
