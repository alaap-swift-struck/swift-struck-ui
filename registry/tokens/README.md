# Layer 0 — Tokens

The single source of truth for every visual value in Swift Struck UI: colors, radii,
surfaces, and (later) spacing and typography scales.

> **Re-skinning this library?** Read the
> [contrast checklist](#re-skinning-the-contrast-checklist) below **before** you
> ship. Swapping token values is a five-minute edit that can silently break
> readability across every page.

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

---

# Re-skinning: the contrast checklist

Because tokens are the only source of truth, a re-skin is just new values in
`styles.css` — no component changes. That is the point, and it is also the risk:
**a token you think of as "the brand colour" is rendered as body text somewhere.**

This is not hypothetical. A fork of this library changed only the token values
and the icon set — 5 lines of visible text differed across three pages — and
produced **209 failing-contrast text nodes** in light mode. The worst was a pale
yellow `--primary` at **1.30:1**, because `--primary` is what
[`article-body`](../collections/article-body/article-body.tsx) uses for **link
text**.

Light mode is the tight one. Dark mode has more headroom, but check both.

## Which tokens carry a floor

| Token                                        | Rendered as                                                           | Floor     | Measured against                                     |
| -------------------------------------------- | --------------------------------------------------------------------- | --------- | ---------------------------------------------------- |
| `--foreground`                               | body text                                                             | **4.5:1** | `--background`                                       |
| `--card-foreground` · `--popover-foreground` | text on those surfaces                                                | **4.5:1** | `--card`/`--popover`                                 |
| `--muted-foreground`                         | secondary text, captions, chart axis + legend labels (~105 uses)      | **4.5:1** | the **tinted** surface it sits on — see trap 2       |
| `--primary`                                  | **link text**, active tab/step labels, selected state, checked marks  | **4.5:1** | `--background`                                       |
| `--success` · `--destructive` · `--warning`  | inline status text and icons (e.g. "3 issues" in the import preview)  | **4.5:1** | `--background`                                       |
| `--accent-foreground`                        | text on `--accent`                                                    | **4.5:1** | `--accent`                                           |
| `--*-foreground` on a solid fill             | label inside a filled Button/Badge                                    | **4.5:1** | its **own fill**, not the page                       |
| `--ring`                                     | focus ring — the only visible focus affordance                        | **3:1**   | both the field **and** the page behind it            |
| `--chart-1` … `--chart-5`                    | bars, areas, pie slices, rating stars, calendar dots — **never text** | **3:1**   | `--background` (and each other, for adjacent slices) |

**No floor** (these are the _denominator_, not the numerator): `--background`,
`--card`, `--popover`, `--muted`, `--secondary`, `--accent`. Darkening any
surface silently lowers every ratio above it, so re-run the check after you
touch one.

`--border` / `--input` sit in between. As used here a control is also identified
by its fill and label, so no hard floor applies — but if your skin makes the
border the _only_ affordance for an input, WCAG 1.4.11 pulls it to **3:1**.

## Three traps

1. **Text floors and graphics floors are different — don't collapse them.**
   Darkening the chart palette to 4.5:1 "to be safe" turns an amber accent to
   ochre for **zero** accessibility gain (we did exactly this in v0.9.2 and
   reverted it in v0.9.4). Keep graphics tokens ≥ 3:1 and no further. The
   converse is the real danger: the amber we started with was **2.13:1** and
   failed even the graphics floor.
2. **Measure `--muted-foreground` on your tinted surfaces, not on white.** Ours
   is 4.73:1 on `#fff` but **4.24:1** on an `--accent`-tinted card — the same
   token passes and fails depending on what's behind it.
3. **Foreground-on-fill pairs are measured against the fill.** `--warning` can
   be too light to read as text while `--warning-foreground` on top of it is
   perfectly fine. Those are two different checks; both must pass.

## How to check your own values

Paste this into the browser console on your themed site. It reads the **resolved**
token values, rasterises them (a naive `oklch()` string parse gets this wrong),
and prints pass/fail per floor. Run it once in light mode and once in dark.

```js
;(() => {
  const FLOOR = {
    foreground: 4.5,
    "card-foreground": 4.5,
    "popover-foreground": 4.5,
    "muted-foreground": 4.5,
    primary: 4.5,
    success: 4.5,
    destructive: 4.5,
    warning: 4.5,
    "accent-foreground": 4.5,
    ring: 3,
    "chart-1": 3,
    "chart-2": 3,
    "chart-3": 3,
    "chart-4": 3,
    "chart-5": 3,
  }
  const cx = document.createElement("canvas").getContext("2d")
  const rgb = (c) => {
    cx.fillStyle = "#000"
    cx.fillStyle = c.trim()
    cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2]]
  }
  const lum = ([r, g, b]) => {
    const f = (v) =>
      (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }
  const cs = getComputedStyle(document.documentElement)
  const bg = rgb(cs.getPropertyValue("--background"))
  console.table(
    Object.entries(FLOOR).map(([t, floor]) => {
      const r = ratio(rgb(cs.getPropertyValue("--" + t)), bg)
      return { token: "--" + t, ratio: +r.toFixed(2), floor, ok: r >= floor }
    })
  )
})()
```

It compares everything to `--background`, which is the right denominator for most
tokens and a close-enough one for the rest. For the two cases it can't see —
`--muted-foreground` on a tinted card, and a `*-foreground` on its own fill —
sample the two real colours off the rendered page and compare those directly.

Then spot-check by eye: **links, placeholder text, chart axis labels, disabled
states, and the focus ring**. Those are where the failures actually land.

## Where our own values stand

Light mode, measured on the live site with the snippet above. Dark mode sits
comfortably at 5.7–10:1 throughout.

| Token                  | Value     | Ratio   | Floor |              |
| ---------------------- | --------- | ------- | ----- | ------------ |
| `--foreground`         | `#0a0a0a` | 19.80:1 | 4.5   | ✅           |
| `--muted-foreground`   | `#737373` | 4.73:1  | 4.5   | ⚠️ see below |
| `--primary` / `--ring` | `#0a8379` | 4.63:1  | 4.5   | ✅           |
| `--success`            | `#008839` | 4.58:1  | 4.5   | ✅           |
| `--destructive`        | `#e7000b` | 4.77:1  | 4.5   | ✅           |
| `--warning`            | `#eab312` | 1.92:1  | 4.5   | ❌ known     |
| `--accent-foreground`  | `#003732` | 13.19:1 | 4.5   | ✅           |
| `--chart-1`            | `#0d8d82` | 4.08:1  | 3     | ✅           |
| `--chart-2`            | `#ce8300` | 3.06:1  | 3     | ✅           |
| `--chart-3`            | `#3a84ca` | 3.94:1  | 3     | ✅           |
| `--chart-4`            | `#be64d2` | 3.53:1  | 3     | ✅           |
| `--chart-5`            | `#5bb661` | 2.53:1  | 3     | ❌ known     |

**Known gaps — logged, not yet fixed:**

- **`--muted-foreground` 4.24:1 on `--accent`-tinted card surfaces** (4.73:1 on
  plain white). A near-miss on secondary text only. Cosmetic; fixing it means
  darkening the token a notch, which touches ~105 call sites' appearance.
- **`--warning` 1.92:1 used as text.** `text-warning` appears in
  [`data-preview-table`](../collections/data-preview-table/data-preview-table.tsx)
  for the issue count and its warning icon. The token itself is fine as a _fill_
  (`bg-warning` with the near-black `--warning-foreground` on it) — this is trap 3. A fix needs a separate on-surface tone rather than darkening `--warning`,
  which would break the badge pairing.
- **`--chart-5` 2.53:1**, below the 3:1 graphics floor set above. Used for pie
  slices and calendar event dots. Raising it means dropping lightness ~0.06;
  chroma usually has to come down a little as lightness does, or the colour
  falls out of sRGB gamut.

If you are re-skinning, **do not inherit these three** — they are our debt, not a
licence to sit under the floor.
