# Session handoff — swift-struck-ui · workstream: library

> **Project:** `swift-struck-ui` — this repo IS the **Swift Struck UI component library**
> (package `@swift-struck/ui`), NOT the Brimba app. Read `HANDOFF.md` at the repo root
> first for the full orientation. This file is the per-workstream session memory.
>
> **Updated:** 2026-08-19. Merged file — earlier entries covered up to
> v0.3.0, then v0.9.x, now through **v0.11.0**. Nothing is dropped on merge; sections are
> updated in place so the reasoning behind old decisions survives.

---

## Current state

- **Package version `0.11.0`.** Local = GitHub (`origin/main`) = staging = production,
  tagged `v0.11.0`.
- **Tests: 290 passing across 37 files.** Gate is green — and it is now ONE command:
  **`npm run verify`** = `tsc --noEmit` + `vitest run` + `guardrails` + `format:check`.
  (`npm run check` still exists but only covers guardrails + format — prefer `verify`.)
- **Health (lean_mean_check): 94/100, Grade A.** Reports at `lean-mean-report.html` +
  `.md` (gitignored, local artifacts).
- **Survivability (mac_fell_in_the_ocean_review): 97/100**, up from 79. Report committed
  at `ocean-review.md` / `ocean-review.html`.
- **91 components** (65 primitives + 26 collections) — authoritative count is
  `registry.json`.
- **Live:** production `https://swift-struck-ui.pages.dev`, staging
  `https://staging.swift-struck-ui.pages.dev`.
- Nothing broken, nothing half-finished.

### Every release is a git tag

`v0.1.0` … `v0.11.0` (20 tags), each verified against the `package.json` at that commit
and each confirmed present on the remote. Hosts pin with
`npm install github:alaap-swift-struck/swift-struck-ui#v0.11.0`.

---

## What shipped since v0.3.0 (chronological)

| Version | What                                                                                                                        |
| ------- | --------------------------------------------------------------------------------------------------------------------------- |
| 0.4.0   | flat List self-rounds; AgentChat attachment slot                                                                            |
| 0.5.0   | **searchable + async filter facets** (`FilterFacet.searchable`, `onSearch`)                                                 |
| 0.5.1   | shared `use-debounce` primitive (`useDebouncedCallback`) — DRY cleanup                                                      |
| 0.6.0   | **numeric range facet** (`control:"range"`) + `Input` placeholder ellipsis                                                  |
| 0.7.0   | **in-header SortControl** + `ListItem.fields`                                                                               |
| 0.7.1   | release hygiene: git tags, tests excluded from tarball, honest install docs                                                 |
| 0.8.0   | **creatable Choice** (`creatable`, `createLabel`, `onCreate`)                                                               |
| 0.9.0   | 6 host-reported primitive fixes (dialog scroll `modal`, ring `shape`, truncation, `RecipeTab.badge`, per-facet clear)       |
| 0.9.1   | **clear ✕ opened the dropdown instead of clearing**                                                                         |
| 0.9.2   | docs-catalog drift, light-mode contrast, chart resize                                                                       |
| 0.9.3   | audit pass: split filter-bar, drift guards, doc corrections                                                                 |
| 0.9.4   | **Card `min-w-0`**, chart tokens restored to graphics floor, stale token paths purged                                       |
| 0.9.5   | **RE-SKIN CONTRAST CHECKLIST** + last 3 contrast gaps closed (new `--warning-strong`); Card/Chart regression guards         |
| 0.9.6   | **Recharts legend labels pinned to the text token** (trap 4); dark-mode fill labels to near-black; chat timestamp opacity   |
| 0.10.0  | **Windowed rendering** in List/CardGrid/DataTable past 100 rows (`use-virtual-rows`); props API unchanged                   |
| 0.10.1  | **Survivability pass** — ocean review 79 → 97: real runbook, prerequisites, ownership, notices, 100% file headers           |
| 0.11.0  | **Host visual slots** — `ScreenRecipe.leading`, node `TabItem.icon`, `StatItem.icon`, recipe details stop inventing avatars |

---

## Key decisions + WHY (these are the ones that matter)

### Contrast: text tokens vs graphics tokens (v0.9.2 → v0.9.4)

- `--primary` and `--success` **are used as text** (`text-primary` ×22, `text-success` on
  the progress-toggle "Done" label) → they must hold **WCAG 4.5:1**. Currently 4.63 / 4.58.
- `--chart-1` … `--chart-5` are **GRAPHICS ONLY** — chart areas, rating stars
  (`fill-chart-2`), 6px calendar dots. Chart axis text uses `muted-foreground`, and legend
  label text does too — but only because `Chart` forces it (see v0.9.6 below; Recharts
  defaults it to the series colour). → the bar is **WCAG 1.4.11 non-text contrast, 3:1**,
  NOT 4.5:1.
- v0.9.2 wrongly darkened the chart tokens to 4.5:1, turning the amber accent to ochre.
  v0.9.4 restored: `--chart-1` → `#0d8d82` (4.08:1, a full revert — it always cleared 3:1),
  `--chart-2` → `#ce8300` (3.06:1).
- **The original amber `#f49f1e` was 2.13:1 and failed even the 3:1 floor** — so do NOT
  "restore" it. This split is documented in `styles.css` so neither side gets reverted.
- Dark mode **page text** is clean (5.7–10:1) and was never touched. Its **filled
  controls** were not, and were fixed in v0.9.6: dark brand fills are LIGHTER than their
  light-mode counterparts, so the near-white label that works in light mode read 3.30:1 on
  `--primary` and 2.77:1 on `--destructive`. Both now use the near-black foreground that
  dark `--success`/`--warning` always had (5.20:1, 6.19:1). Rule to carry: **a bright fill
  in a dark theme wants a dark label** — check fill/label pairs in BOTH modes.
- **v0.9.6 — a dependency can put your fill token into text.** Recharts colours legend
  **labels** with the series colour by default; the chart palette sat at the 3:1 graphics
  floor on the (wrong) basis that it was never text. `--chart-2` was rendering as 12px text
  at 3.05:1. `Chart` now pins the legend label to `--muted-foreground` via `formatter`; the
  swatch keeps the series colour. Guarded in `chart.test.tsx`, proven able to fail. This is
  trap 4 in the checklist. The lesson generalises: **audit the rendered page, not your JSX.**
- **This knowledge now lives in `registry/tokens/README.md` as a RE-SKIN CHECKLIST**, linked
  from README.md — a forker reads the README, not our token comments. Written because a fork
  changed only the token values + icon set (5 lines of visible text differed across three
  pages) and produced **209 failing text nodes** vs our 39 on the identical page; worst was a
  pale-yellow `--primary` at **1.30:1**, since `--primary` is the **link** colour.
  The checklist carries a copy-pasteable console snippet (canvas rasterisation — a naive
  `oklch()` string parse gets it wrong) that prints pass/fail per token.

#### Contrast register (light mode) — v0.9.5: EVERY floor-carrying token clears its floor

`--foreground` 19.80 · `--accent-foreground` 13.19 · `--muted-foreground` 5.39 ·
`--warning-strong` 4.88 · `--destructive` 4.77 · `--primary`/`--ring` 4.63 · `--success` 4.58
· `--chart-1` 4.08 · `--chart-3` 3.94 · `--chart-4` 3.53 · `--chart-5` 3.17 · `--chart-2`
3.06. (`--warning` is a fill: 1.92 vs the page, but **9.33** for its own label — the check
that matters.) The live register lives in `registry/tokens/README.md`; keep them in sync.

**All three gaps below were CLOSED in v0.9.5.** Kept here because the _reasoning_ is what
matters — a future re-skin will hit the same three shapes.

1. **`--muted-foreground` — the denominator trap. `0.556` → `0.525` (`#6a6a6a`).**
   The user reported 4.24:1 on tinted card surfaces; reproduced exactly, then measured the
   **real DOM** on prod rather than assuming a surface: 207 muted-foreground nodes, 198 on
   plain white at 4.74 (fine), and **5 shipped components failing** — a hovered list row at
   **4.14** (the true worst, worse than the reported 4.24), chat timestamps and an inactive
   tab at 4.35, the command-menu ⌘ hint at 4.24. Now 4.71 on the worst, 5.39 on white.
   → **Lesson: measuring against `--background` HIDES this class of failure entirely.**
   The fix is systemic (the token), not per-component — 4 different components had it, so
   patching call sites would have been whack-a-mole and left re-skinners in the same trap.
2. **`--warning` — the fill-vs-text trap. New `--warning-strong` token (`#946a00`, 4.88:1).**
   `--warning` was 1.92:1 used as TEXT (`text-warning` in `data-preview-table`: the issue
   count and its TriangleAlert). But it's fine as a _fill_ — `--warning-foreground` on it is
   **9.33:1**, and the light amber is the accent identity. So: **do NOT darken `--warning`**;
   that fixes the text and breaks the badge. A separate on-surface tone is the answer.
   Dark mode gets `--warning-strong` as an ADDITION (11.5:1) so the utility resolves in both
   themes — no existing dark value was changed.
3. **`--chart-5` — we broke our own floor. `0.7` → `0.64` (`#47a34e`), 2.52 → 3.17.**
   Was under the 3:1 graphics floor this library sets for itself (pie slices, calendar dots).
   Chroma usually has to come down with lightness or the colour leaves sRGB gamut.
   → **Lesson: a documented floor is worthless until you measure your own values against it.
   Writing the checklist is what found gaps 2 and 3 — neither was reported.**

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

### Windowed rendering (v0.10.0) — and the bug only a real browser could find

`List` / `CardGrid` / `DataTable` window their rows past **100** (`VIRTUALIZE_THRESHOLD`).
`lib/virtual.ts` = DOM-free math; `registry/primitives/use-virtual-rows` = measure +
subscribe. Automatic, so **no host recipe changed**; `virtualize={false}` is the escape hatch.

- **It's a prop, not config.** `XConfig` fields are all-required by rule, so a new config
  field would have broken every call site. Same reasoning as `modal`/`onSearch`.
- **No fixed height, no scroll container prop.** The hook finds whichever ancestor already
  scrolls and falls back to the page. Imposing our own bounded scroller would have been a
  visible layout change on every existing screen.
- **Pitch and column count are MEASURED**, by finding the first child that starts a new
  visual row. One hook then serves a list, a table body, and a grid that re-flows at
  breakpoints, with no prop to keep in sync.
- Spacers differ per layout **because the layout forces it**: padding for list (a spacer div
  takes a `divide-y` border and paints a stray rule) and grid (a spacer occupies a grid track
  and shifts every later card a column); spacer **rows** for the table (padding on a `tbody`
  is not rendered in table layout). `DataTable` stripes by the **absolute** index — the
  sliced index restarts the zebra pattern at every window.

**THE BUG — `findScroller` must skip `<html>`/`<body>`.** This library sets
`html { overflow-x: hidden }`, and CSS computes the _other_ axis of a hidden overflow to
`auto` — so the root always looked like a scroll container. It would then be measured like
one, and for the root `getBoundingClientRect().top` is `-scrollTop`, which cancels the scroll
out **exactly**: the window sat still while the page scrolled. Invisible to the unit tests
(they return stubbed rects), found in 5 minutes in a real browser. Now guarded by a test that
makes `<html>` look scrollable and asserts the window still advances.

### Host visual slots (v0.11.0) — pictures in recipe screens

A host agent reported that every recipe-driven collection rendered as two lines of text
while its HAND-COMPOSED lists over the same records drew each record's logo. The rows
already carried the picture and `List.leading` / `CardGridItem.media` already existed —
`screen-renderer` simply never filled them. Four gaps of that shape, closed together.

- **`ScreenRecipe.leading?: string`** — a COLUMN name, not a render prop. Recipes in the
  host are declared as plain data in one file; a function inside a recipe would make them
  unserialisable. The host already shapes its rows (`shapeAccountsList`), so putting the
  node in the row is one line at the place that already knows the record.
- **No default mark.** A recipe that names no column gets no box. An empty grey square on
  every row of a list that has no pictures is worse than the text rows it replaced.
- **`asNode()` guards the cast.** Row values are `unknown`; React THROWS on an object
  child, which would take the whole screen down. Anything undrawable renders as nothing.
  A plain string still renders as text — deliberately, so pointing `leading` at a raw
  `logoUrl` shows you the URL instead of failing silently.
- **`TabItem.icon` widened to `React.ReactNode`** rather than adding a second field: a
  string is still read as a lucide name (`""` = none), so every existing caller is
  untouched and a tab set stays serialisable. Adding a required 5th field would have
  broken every host that builds `TabItem` objects literally.
- **`StatItem.icon`** sits BESIDE the label (label truncates, glyph `shrink-0`), not above
  the number — a long label then cannot push it out of the card.
- **The one behaviour change:** `screen-renderer` used to pass `avatarFallback={initials}`
  unconditionally, so every recipe detail opened with two letters of its own title in a
  circle. Now initials are passed ONLY when `header.avatar` is declared. Hosts that want
  the old look add `avatar: "<column>"`. `RecordDetail` also gained
  `avatarShape: "circle" | "square"` — a company logo cropped to a circle is a wordmark
  nobody can read.
- **The acceptance test is the guardrail, not the feature.**
  `registry/collections/slots.test.tsx` renders rows that ALWAYS carry a picture column
  and changes only the RECIPE, so "omitting `leading` changes nothing" is proven about the
  recipe rather than about the data. All 13 tests were mutation-checked (8 mutations, each
  went red).
- **Browser-verified in real Chrome:** marks in the list rows, media above the card
  header, glyphs top-right with a truncating label, `icon: "inbox"` still loading the
  lucide chunk, square avatar `border-radius: 12px`, the gallery's own recipe detail now
  avatar-free with title/subtitle intact, and 0px horizontal overflow throughout.

### Survivability (v0.10.1) — the ocean review, and what it caught

`mac_fell_in_the_ocean_review` asks one question: the author and their machine are gone —
can a stranger holding ONLY the remote copy run it, understand it and carry it on?
**79 → 97.** Full report committed at `ocean-review.md` / `.html`.

**The drill is the part that matters.** It clones the REMOTE (never the local folder) into
scratch and follows only the written docs. Result: clone → `npm install` → 277 tests →
guardrails → `tsc` → `npm run dev` serving HTTP 200 in **19 seconds**, and the README's
headline promise (installing the library into a fresh app from GitHub) also worked with
0 test files in the tarball. Then it **stopped dead at deployment**.

**THE FINDING: `DEPLOY.md` was fiction.** It told the reader to run `npm run changeset` and
`npm run release` — neither script has ever existed, there is no `.changeset` and no
`release.yml` — and it contradicted `OPERATIONS.md` about how deploys actually happen. The
README's docs map pointed at it and never mentioned `OPERATIONS.md`, the accurate one.
**Worse: the literal `wrangler` command lived only inside the `/ship-staging` skill under
`~/.claude` — on the laptop, not in the repo.** The lesson generalises:
_if a step only exists in a skill, it does not survive the machine._

- `OPERATIONS.md` is now **the operational source of truth**: real deploy commands, rollback
  with a **named trigger**, credentials inventoried **by name never by value**, a
  "what to check when it breaks" list, the account inventory, and an inheritance section.
- `DEPLOY.md` replaced; it states plainly that its old contents described a pipeline that
  was never built, and points at `OPERATIONS.md`.
- Added `.nvmrc` + `engines: node>=20` (CI already ran 20; **nothing in the repo said so**),
  a README prerequisites table, `.devcontainer/`, `CODEOWNERS`, maintainer fields in
  `package.json`, and `NOTICE.md`.

**Found while writing `NOTICE.md`: `react-leaflet` is Hippocratic-2.1, not MIT** — a non-OSI
licence with use restrictions, and a `dependencies` entry, so every consumer inherits it.
Only `Map` uses it. Documented with the unmade decision (moving it to optional
`peerDependencies`) rather than left for a consumer's legal review to find.

**Every source file now opens with a purpose line — 154/154, up from 38%.** Not filler: each
carries the reason the file is shaped that way where one exists (Button's
`[&_svg]:pointer-events-none` trap, Badge's fill-vs-text contrast pairing, Card's `min-w-0`).
**Caveat worth keeping:** the probe reports 46% because it checks **line 1 only**, and 84
files must legally open with `"use client"` before any comment. The row was scored earned on
the rubric's own "judge content, not shape" rule, and the override plus a verification
command are recorded in `ocean-review.md`.

**`cf-exec` is mandatory for Cloudflare commands.** This machine hosts more than one
Cloudflare account and a bare `npx wrangler` silently resolves to the DEFAULT one. Prefix
every Cloudflare call: `cf-exec npx wrangler ...`. `cf-exec --check` names the account
without running anything (this folder → **Swift Struck**, registered).

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
  Hit this again in v0.10.0 — in real Chrome, split "act" and "measure" into two calls.
- **The preview pane reports `innerHeight: 0` AND `documentElement.clientHeight: 0`.** Real
  Chrome reports both correctly (986). Anything that divides by the viewport is unverifiable
  in the pane — use real Chrome.
- **`window.scrollTo()` in a backgrounded CDP tab moves the geometry but fires NO scroll
  event**, so scroll-driven code looks frozen and you will "confirm" a bug that isn't there
  (I did, for several minutes). Scroll **and then dispatch** `new Event("scroll")`; the rects
  are real, only the event is missing.
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
4. **`sharp` 3 high advisories** — via `www → next` only, not a library dep, unreachable in
   a static export (`images.unoptimized`). No non-breaking fix; **not** forced.

### Settled — do NOT re-open as "pending"

- **Distribution is GitHub-only, not npm.** A deliberate choice, recorded at HANDOFF.md:79
  ("one organized place"), not a blocked task. The one real cost — npm resolves a GitHub dep
  to a **commit SHA**, so a plain `npm install` never pulls new code — is already handled by
  the "Updating" section of README.md. No case to revisit.
- **`.session-notes/` is committed** (user confirmed 2026-08-06): it is shared memory, and
  that is intended. Not gitignored, on purpose.
- **No second remote / mirror.** Offered during the ocean review and **declined by the user**
  (2026-08-12). GitHub remains the only copy; this is why criterion 1 sits at 95 not 100.
  Do not re-raise it as a pending task — it is a decision, not a gap.
- **`react-leaflet` stays a normal dependency.** Making it an optional peer was offered and
  **declined**. The licence position is documented in `NOTICE.md`; that is the whole action.
- **The truck factor stays 1.** 40 points on criterion 10 need a second contributor. No
  document can earn them — stop treating it as a documentation problem.

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

**Shipped library — v0.10.0 windowed rendering**

- `lib/virtual.ts` — NEW: the DOM-free windowing arithmetic (`windowSlice`,
  `initialWindow`). In `lib` because it is pure logic, like `lib/range.ts`.
- `registry/primitives/use-virtual-rows/use-virtual-rows.tsx` — NEW: measures pitch +
  live column count off the DOM, finds the scrolling ancestor, subscribes. **Read the
  `findScroller` comment before touching it** — the `<html>` trap is recorded there.
- `registry/collections/{list,card-grid,data-table}` — each applies the same numbers the
  way its own layout demands (padding for list/grid, spacer ROWS for the table).

**Repo hygiene — v0.10.1**

- `.nvmrc`, `.devcontainer/devcontainer.json`, `CODEOWNERS`, `NOTICE.md` — all NEW.
- `package.json` — `engines`, `author`, `repository`, `homepage`, `bugs`, and the
  **`verify`** script (the one command the docs now point at).
- `OPERATIONS.md` — rewritten; now the operational source of truth (see the v0.10.1
  section above). `DEPLOY.md` — rewritten; was fiction.
- `ocean-review.md` / `ocean-review.html` — the survivability report, committed.
- **39 source files** gained a header comment (31 components + 8 config/harness), taking
  purpose-line coverage to 154/154.

**Tests**

- `lib/virtual.test.ts`, `registry/primitives/use-virtual-rows/use-virtual-rows.test.tsx`,
  `registry/collections/virtualization.test.tsx` — NEW (v0.10.0), 52 tests, **every one
  mutation-checked**. See "Write tests that can actually fail".
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
