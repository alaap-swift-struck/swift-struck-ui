# Session handoff — swift-struck-ui · workstream: library

> **Project:** `swift-struck-ui` — this repo IS the **Swift Struck UI component library**
> (package `@swift-struck/ui`), NOT the Brimba app. Read `HANDOFF.md` at the repo root
> first for the full orientation. This file is the per-workstream session memory.
>
> **Updated:** 2026-08-06 (merged; earlier entry covered up to v0.3.0). Written before a
> `/compact`.

---

## Current state

- **Package version `0.9.4`.** Local = GitHub (`origin/main`) = staging = production, all
  at commit **`c26c028`**, tagged `v0.9.4`. Working tree clean.
- **Tests: 224 passing across 33 files.** Gate is green: `tsc` (root AND `www`),
  `npm test`, `npm run guardrails` (176 modules, 0 violations), `npm run format:check`.
- **Health (lean_mean_check): 94/100, Grade A.** Reports at `lean-mean-report.html` +
  `.md` (gitignored, local artifacts).
- **90 components** (64 primitives + 26 collections) — authoritative count is
  `registry.json`.
- **Live:** production `https://swift-struck-ui.pages.dev`, staging
  `https://staging.swift-struck-ui.pages.dev`.
- Nothing broken, nothing half-finished.

### Every release is a git tag

`v0.1.0` … `v0.9.4`, each verified against the `package.json` at that commit. Hosts pin
with `npm install github:alaap-swift-struck/swift-struck-ui#v0.9.4`.

---

## What shipped since v0.3.0 (chronological)

| Version | What                                                                                                                  |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| 0.4.0   | flat List self-rounds; AgentChat attachment slot                                                                      |
| 0.5.0   | **searchable + async filter facets** (`FilterFacet.searchable`, `onSearch`)                                           |
| 0.5.1   | shared `use-debounce` primitive (`useDebouncedCallback`) — DRY cleanup                                                |
| 0.6.0   | **numeric range facet** (`control:"range"`) + `Input` placeholder ellipsis                                            |
| 0.7.0   | **in-header SortControl** + `ListItem.fields`                                                                         |
| 0.7.1   | release hygiene: git tags, tests excluded from tarball, honest install docs                                           |
| 0.8.0   | **creatable Choice** (`creatable`, `createLabel`, `onCreate`)                                                         |
| 0.9.0   | 6 host-reported primitive fixes (dialog scroll `modal`, ring `shape`, truncation, `RecipeTab.badge`, per-facet clear) |
| 0.9.1   | **clear ✕ opened the dropdown instead of clearing**                                                                   |
| 0.9.2   | docs-catalog drift, light-mode contrast, chart resize                                                                 |
| 0.9.3   | audit pass: split filter-bar, drift guards, doc corrections                                                           |
| 0.9.4   | **Card `min-w-0`**, chart tokens restored to graphics floor, stale token paths purged                                 |

---

## Key decisions + WHY (these are the ones that matter)

### Contrast: text tokens vs graphics tokens (v0.9.2 → v0.9.4)

- `--primary` and `--success` **are used as text** (`text-primary` ×22, `text-success` on
  the progress-toggle "Done" label) → they must hold **WCAG 4.5:1**. Currently 4.63 / 4.58.
- `--chart-1` … `--chart-5` are **GRAPHICS ONLY** — chart areas, rating stars
  (`fill-chart-2`), 6px calendar dots. Chart axis/legend text uses `muted-foreground`.
  → the bar is **WCAG 1.4.11 non-text contrast, 3:1**, NOT 4.5:1.
- v0.9.2 wrongly darkened the chart tokens to 4.5:1, turning the amber accent to ochre.
  v0.9.4 restored: `--chart-1` → `#0d8d82` (4.08:1, a full revert — it always cleared 3:1),
  `--chart-2` → `#ce8300` (3.06:1).
- **The original amber `#f49f1e` was 2.13:1 and failed even the 3:1 floor** — so do NOT
  "restore" it. This split is documented in `styles.css` so neither side gets reverted.
- Dark mode was never touched and is clean (5.7–10:1).
- **This knowledge now lives in `registry/tokens/README.md` as a RE-SKIN CHECKLIST**, linked
  from README.md — a forker reads the README, not our token comments. Written because a fork
  changed only the token values + icon set (5 lines of visible text differed across three
  pages) and produced **209 failing text nodes** vs our 39 on the identical page; worst was a
  pale-yellow `--primary` at **1.30:1**, since `--primary` is the **link** colour.
  The checklist carries a copy-pasteable console snippet (canvas rasterisation — a naive
  `oklch()` string parse gets it wrong) that prints pass/fail per token.

#### Contrast register (light mode, measured live on prod — verified twice, offline + snippet)

Passing: `--foreground` 19.80 · `--destructive` 4.77 · `--muted-foreground` 4.73 (on white)
· `--primary`/`--ring` 4.63 · `--success` 4.58 · `--accent-foreground` 13.19 · `--chart-1`
4.08 · `--chart-3` 3.94 · `--chart-4` 3.53 · `--chart-2` 3.06.

**Three logged gaps — known, not fixed, do not let these get lost:**

1. `--muted-foreground` **4.24:1 on `--accent`-tinted card surfaces** (4.73 on plain white).
   Near-miss, secondary text only, cosmetic. Fixing = darken the token, which changes the
   look of ~105 call sites. _(User-reported; independently reproduced to the same 4.24.)_
2. `--warning` **1.92:1 used as TEXT** — `text-warning` in `data-preview-table`, on both the
   issue count and its TriangleAlert icon. The token is fine as a _fill_ (`bg-warning` with
   the near-black `--warning-foreground` on top). So the fix is a separate on-surface tone,
   **not** darkening `--warning`, which would break that badge pairing.
   _(Found 2026-08-06 while writing the checklist.)_
3. `--chart-5` **2.53:1 — below the 3:1 graphics floor we ourselves set.** Pie slices +
   calendar event dots. Fix = drop lightness ~0.06, and chroma usually has to come down with
   it or the colour leaves sRGB gamut. _(Found 2026-08-06 writing the checklist.)_

### `min-width: auto` is the recurring villain — fix it at the producer

Three separate bugs this session had the same root cause: a flex/grid item defaults to
`min-width: auto` and **refuses to shrink below its widest child**.

1. Choice's trigger sheared text mid-letter → `min-w-0` on the trigger span.
2. Chart wouldn't shrink on resize → `min-w-0` + `overflow-hidden` on the chart wrapper.
3. **The page scrolled sideways → `Card` had no `min-w-0`** (v0.9.4). This was the real
   cause; the chart fix was correct but one level too low. Fixed on the **Card primitive**
   so it can't recur wherever a wide child lands in a Card.
   → **Rule: fix this where the grid/flex child is produced, never per-consumer.**

#### What actually stops these regressing

_Be precise here. A green suite that doesn't cover the thing that broke twice is worse than a
known gap, because it reads as coverage._
`card.test.tsx` + `chart.test.tsx` (added 2026-08-06). **Every assertion was proven able to
fail**: reverting `min-w-0` on Card and reverting the chart effect to grow-only
(`setWidth(w => Math.max(w, el.clientWidth))`) turns **5 tests red**.

COVERED, automatically:

- Chart **measures synchronously on mount** (the fresh-load case).
- Chart **accepts a SMALLER width** from a ResizeObserver callback — _this is the exact
  regression that shipped twice_. jsdom has no RO, so the test installs a controllable one
  and stubs `clientWidth`; it drives the mechanism by hand.
- The `window.resize` listener works **independently** of the observer (the second trigger).
- Observer subscribe + unmount cleanup.
- `min-w-0` present on Card — plain, with consumer classNames, and with a wide child — and
  `min-w-0 overflow-hidden` on the chart wrapper.

**NOT covered, and cannot be in this harness — say so rather than implying otherwise:**

- **Real layout.** jsdom has no layout engine: everything is 0×0, `offsetWidth` is always 0,
  CSS never cascades. "Render a wide child, assert the parent didn't widen" would pass
  identically against a Card with `min-w-0` deleted — a test that cannot fail. So the Card
  guard is a **class contract**, not a pixel assertion, and the test file says so at the top
  to stop someone "improving" it into a fake.
- **Whether the browser honours it.** Verified by hand at 1280 → 700 → 375 with no reload
  (0px overflow, confirmed by the user independently on prod). That check is **manual** and
  there is currently **nothing automated** behind it.
- Closing that gap needs a real browser (Playwright/e2e). Not added: it's a large new dep
  against the anti-bloat mandate, and it's the user's call — see Open questions.

### `[&_svg]:pointer-events-none` on Button (the v0.9.1 bug)

Button's base class removes EVERY descendant svg from hit-testing. So an interactive `<X>`
nested inside a Button **never receives the click** — it falls through to the Button.

- Symptom: the filter's clear ✕ opened the dropdown instead of clearing.
- Fix: the ✕ must be a **real sibling `<button>`**, never an svg inside the trigger. Applied
  to RangeFacet, SearchableFacet and Choice's `clearable` ✕.
- **Do NOT** remove `[&_svg]:pointer-events-none` (load-bearing for every icon button), and
  do NOT patch `pointer-events-auto` onto the icon (leaves it keyboard-unreachable).

### One matching engine, extended — never forked

The `range` facet compiles to the rule engine's **inclusive `gte`/`lte`** ops rather than a
parallel numeric filter. When a new filter kind needs a comparison the engine can't express,
**add the operator** — never a second engine. (ARCHITECTURE.md states this.)

- Related fix: numeric ops now reject blank/missing/non-numeric values. `Number("")` is `0`,
  so a blank field used to satisfy `price ≤ 5` while a _missing_ one didn't — inconsistent
  with itself and with SQL. Now all three fail, matching SQL NULL semantics.

### Config vs runtime state

`sortBy`/`sortDir` in `CollectionConfig` are the **declared initial** sort; the user's live
choice is runtime state in `CollectionFrame`. Same split as builder `filter` vs user
`facetValues`. Config stays declarative; read live values off `onQueryChange`.

### One seam, not three

`onQueryChange` emits `{query, facetValues, sortBy, sortDir}` together — that's exactly the
payload a server-side host turns into its next request. Resist adding a second callback.

### `modal` is opt-in and defaults to false

A popover is portaled to `<body>`; inside a Dialog the dialog's scroll lock kills its
wheel/touch events. `modal` hands the popover its own lock. It stays **off by default**
because a modal popover also traps focus and blocks outside clicks — which would break
click-through between in-page controls. Threaded through Choice / FilterBar / SortControl /
CollectionFrame.

### Drift is now machine-enforced (`registry/catalog-sync.test.ts`)

Four tests, all proven to fail against the real drift they guard:

1. every `registry.json` entry is in the docs catalog, or declared exempt **with a reason**;
2. the exemption list stays honest (no stale entries);
3. README + HANDOFF prose counts match `registry.json` (**PROGRESS.md excluded — it's a
   changelog and legitimately quotes historical numbers**);
4. markdown links resolve, and **no doc claims the design tokens live in `globals.css`**.

Deliberately NOT added: "every backticked path must exist" — docs legitimately use shorthand
(`logic.ts`, the hypothetical `FancyButton.tsx`), so it would be noisy enough to get disabled.

### Tokens live in root `styles.css`

`www/app/globals.css` is a **3-line shim** that imports tailwind + `../../styles.css`.
A stale HANDOFF line claiming otherwise sent a whole debugging session at the wrong file.
Fixed in HANDOFF, ARCHITECTURE (×3 + directory map + two stale `.mdx` claims) and
`registry/tokens/README.md` (×2, incl. a link resolving nowhere), and now guarded by test 4.

---

## Established patterns / conventions

- **Definition of done = the 4 search surfaces:** `registry.json`, `CONFIG-REFERENCE.md`,
  the docs catalog (`www/app/documentation/page.tsx`), and the gallery
  (`www/app/components/page.tsx` + `_data.ts`) — plus `logic.ts` + `*.test.*` when there's
  pure logic. The catalog is now test-enforced.
- **Config-driven components:** every field required, ship a `defaultXConfig`, consumers
  spread the default. Functions (`onSearch`, `onCreate`, `modal`) are **props, not config** —
  config must stay serializable.
- **Tests:** pure logic → `logic.ts` + `*.test.ts`; components → `*.test.tsx` (RTL).
  Security guards ship with a **hostile-input** regression test.
- **UI rules:** no emojis, lucide icons only, token-driven (no hex), never force horizontal
  page scroll, `sm:` Tailwind breakpoints (NO JS width checks).
- **Verify gate before commit:** `npx tsc --noEmit` (root AND `www`), `npm test`,
  `npm run guardrails`, `npm run format:check`.
- **Ship pipeline:** gate → commit + push → `npm run build:static` → `npx wrangler pages
deploy www/out --project-name swift-struck-ui --branch <staging|main> --commit-dirty=true`.
  Config in `OPERATIONS.md`. Bump the version + tag when consumer-facing.
  **Don't run `npm run build` while the dev server is up.**

### Write tests that can actually fail — this bit twice

Before trusting a new regression test, **revert the fix and confirm the test goes red.**

- The v0.9.1 clear-✕ guard: a click-based test would have passed against the broken code
  (jsdom does no hit-testing, so `pointer-events-none` has no effect). The assertions are
  **structural** instead — a real, named, focusable `<button>` outside the trigger. Proven
  by reverting: 5 tests failed.
- The Select-clear fix has **no** unit test on purpose: jsdom renders the placeholder either
  way (both branches probed), so any test would pass regardless. Verified in a real browser
  and the reasoning is recorded in the code + test file so nobody "adds the missing test".

### Browser-verification gotchas (IMPORTANT — cost real time)

- The headless preview pane gives **garbage layout numbers** (`innerWidth: 0`) once it drifts;
  re-open it. Real Chrome measures reliably but **won't narrow below ~1710px** on this Mac.
- **Neither harness delivers `ResizeObserver` callbacks or `resize` events** — measured 0 of
  each while the viewport changed 375 → 900. A CDP-driven Chrome tab is backgrounded, so it
  doesn't render. To test a re-measure, **dispatch the event directly**. This is _why_ the
  chart's `window.resize` listener is not redundant with its observer, and why the unit
  guard in `chart.test.tsx` drives both by hand — see "What actually stops these regressing".
- The pane's `javascript_tool` **awaits async IIFEs**; Chrome's **does not** (returns `{}`).
- React state is async — **`await` a tick after a click before reading the DOM**, or you read
  the pre-render DOM and wrongly conclude the fix failed (this happened).
- `elementFromPoint` is the browser's real hit-test — the right tool for "is this clickable".
  It returns null for off-screen elements, so `scrollIntoView` first.
- The `computer` tool takes **screenshot** coordinates, not CSS pixels — click **by `ref`**.
- The gallery holds scroll at top on load, so screenshots often snap away from the target.
  **DOM measurement > screenshots.**

---

## Open questions / not-yet-done

1. **Showcase split** (the only thing holding Size & Scope at 91, everything else ≥94):
   `www/app/components/page.tsx` 2431 LOC, `_data.ts` 1275, `documentation/page.tsx` 956 —
   ~24% of the codebase, **none of it shipped to consumers**. Split `_data.ts` by domain
   behind a barrel re-export (keeps every import working). Deliberately left as its own
   reviewable change.
2. **A real-layout test harness (Playwright or similar)** — the ONE open item behind the
   `min-width: auto` family. jsdom is 0×0 and delivers no RO/resize events, so the unit
   guards cover the _mechanism_ but nobody checks the browser actually reflows. Would also
   unlock render tests for CalendarView / ImportWizard. **Cost:** a substantial new dev
   dependency against the anti-bloat mandate. **User's call — don't add it unilaterally.**
3. **Workspace-package restructure** — deferred; scope as a written PLAN first.
4. **Fix or accept the three logged contrast gaps** (`--warning` as text 1.92:1, `--chart-5`
   2.53:1, `--muted-foreground` 4.24:1 on tinted surfaces). See the contrast register above.
5. **`sharp` 3 high advisories** — via `www → next` only, not a library dep, unreachable in
   a static export (`images.unoptimized`). No non-breaking fix; **not** forced.

### Settled — do NOT re-open as "pending"

- **Distribution is GitHub-only, not npm.** A deliberate choice, recorded at HANDOFF.md:79
  ("one organized place"), not a blocked task. The one real cost — npm resolves a GitHub dep
  to a **commit SHA**, so a plain `npm install` never pulls new code — is already handled by
  the "Updating" section of README.md. No case to revisit.
- **`.session-notes/` is committed** (user confirmed 2026-08-06): it is shared memory, and
  that is intended. Not gitignored, on purpose.

---

## Outstanding host follow-ups (Acrymold ERP)

Nothing blocks them, but these library features stay **inert** until wired:

- **Pass `modal`** on any Choice/FilterBar/SortControl/CollectionFrame that can render in a
  Dialog — the dialog-scroll fix does nothing without it. (The important one.)
- Add `triggerLabel` to currency options (`"INR"` in the closed control, full name in the menu).
- Set `badge` on recipe tabs.
- Use `Field shape="group"` for pill/chip groups, `"pill"` for rounded single controls.
- Re-check any numeric filter results if pinned below v0.7.0 (the blank-field fix changed them).

---

## Files touched this session (why they matter)

**Shipped library**

- `styles.css` — the theme + tokens (**the one shipped source of truth**); contrast work lives here.
- `registry/primitives/card/card.tsx` — `min-w-0` (v0.9.4, the sideways-scroll fix).
- `registry/primitives/filter-bar/` — split into `filter-bar.tsx` (206) + `range-facet.tsx`
  (173) + `searchable-facet.tsx` (202); clear-✕ fix; per-facet clear; Select remount-on-clear.
- `registry/primitives/choice/choice.tsx` — creatable, `triggerLabel`, `modal`, clearable ✕ fix.
- `registry/primitives/sort-control/sort-control.tsx` — NEW (v0.7.0).
- `registry/primitives/use-debounce/use-debounce.tsx` — NEW (v0.5.1).
- `registry/primitives/{input,field,slider,status-stepper,popover}/` — ellipsis, `shape`,
  multi-thumb, ring-clip, `modal` docs.
- `registry/collections/chart/chart.tsx` — resize measure + `min-w-0 overflow-hidden`.
- `registry/collections/collection-frame/collection-frame.tsx` — sort state, `modal`, one seam.
- `lib/config.ts` — `SortOption`, `FilterFacet` (`range`/`searchable`/`onSearch`),
  `SEARCHABLE_THRESHOLD`, `gte`/`lte`, numeric-op semantics.
- `lib/range.ts` — NEW: `parseRange`/`formatRange` (in `lib` because BOTH `selectRows` and
  the FilterBar primitive need it — a primitive may import lib, lib may never import a primitive).
- `lib/recipe.ts` — `RecipeTab.badge` + `badgeVariant`.

**Tests**

- `registry/catalog-sync.test.ts` — NEW: the 4 drift guards. The link guard now also
  validates **anchored** links (`file.md#section`), which previously slipped past it entirely.
- `registry/primitives/card/card.test.tsx` — NEW (2026-08-06): the `min-w-0` guard.
- `registry/collections/chart/chart.test.tsx` — NEW (2026-08-06): the shrink guard, with a
  controllable ResizeObserver + stubbed `clientWidth`. See "What actually stops these
  regressing" for exactly what it does and does not cover.
- `registry/primitives/filter-bar/filter-bar-clear.test.tsx` — NEW: all 4 control types.
- `registry/primitives/choice/choice-dialog.test.tsx` — NEW: the dialog/modal wiring.

**Docs**

- `PROGRESS.md` (changelog per version), `README.md`, `HANDOFF.md`, `ARCHITECTURE.md`,
  `CONFIG-REFERENCE.md`, `GLIDE-PARITY.md`, `registry/tokens/README.md`,
  `registry/primitives/README.md`, `www/app/documentation/page.tsx` (catalog).
- `registry/tokens/README.md` — now carries the **RE-SKIN CONTRAST CHECKLIST**: which tokens
  carry a floor, which floor and why, text vs fill, a paste-in console snippet, and our own
  measured values including the three logged gaps. **Linked from README.md in two places**
  (the token bullet and the docs list) because forkers read the README, not token comments.
