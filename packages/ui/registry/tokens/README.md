# Layer 0 — Tokens

The single source of truth for every visual value in Swift Struck UI: colors, radii,
surfaces, and (later) spacing and typography scales.

## Where they live

The canonical tokens are defined as CSS variables in
[`app/globals.css`](../../app/globals.css) inside the `:root` / `.dark` /
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

Adding a new token means editing `app/globals.css` once. Every consumer updates
automatically.
