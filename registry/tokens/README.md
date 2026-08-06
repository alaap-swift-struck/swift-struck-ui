# Layer 0 — Tokens

The single source of truth for every visual value in Swift Struck UI: colors, radii,
surfaces, and (later) spacing and typography scales.

## Where they live

The canonical tokens are defined as CSS variables in
[`styles.css`](../../styles.css) at the repo root, inside the `:root` / `.dark` /
`@theme` blocks. This folder holds any **TypeScript** token helpers that
components need to read at runtime (e.g. a typed list of theme names, or
platform-specific token maps for the future native skins).

## The one rule

- Nothing here imports a primitive or a collection. Tokens are the root of the
  dependency graph. (`npm run guardrails` enforces this.)

## How other layers use tokens

Components reference tokens through Tailwind utilities, never raw values:

```tsx
// ✅ resolves to a token — re-themes for free
<div className="bg-background text-foreground rounded-lg" />

// ❌ never do this — invisible to theming, a future migration headache
<div style={{ background: "#ffffff", borderRadius: "10px" }} />
```

Adding a new token means editing root `styles.css` once. Every consumer updates
automatically.

## Contrast floor (light mode)

The brand tokens that get used as **text or icons** — `--primary`, `--chart-1`,
`--chart-2`, `--success` — are tuned to clear **WCAG AA 4.5:1** against the light
`--background`, and `--ring` follows `--primary`. Light mode is the tight one:
dark mode sits comfortably at 5.7–10:1.

When re-theming, change the **hue** freely but re-check the ratio before dropping
lightness back up — several of these previously sat between 2.1:1 and 4.1:1, which
failed for label text and (at 2.13:1) even for the Rating stars, where the 3:1
graphics floor applies. Chroma usually has to come down a little as lightness does,
or the colour falls out of sRGB gamut.
