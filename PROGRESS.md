# Swift Struck UI — build progress

A running tally of the library. Updated each batch. No percentages — just
what's built and what's left.

> **Built: 91 components** (65 primitives + 26 collections) &nbsp;·&nbsp; **Tests: 276 across 36 files** &nbsp;·&nbsp; _Glide parity complete · agent/app surfaces added · config-driven screen engine · status-stepper primitive · searchable/async/range filter facets · creatable Choice · in-header sort control · shared debounce hook · library-wide XSS hardening · component + interaction + security test suite in CI._

> The live counts are authoritative from `registry.json` (components) and
> `npm run guardrails` ("N modules", which also counts logic + test files).

> **Glide config reference:** see `GLIDE-CONFIG-RESEARCH.md` — every component's real Glide config options, the source of truth for parity.

---

## 🌊 Survivability pass — ocean review 79 → 97 (v0.10.1)

An **ocean review** asks one question: the author is gone and their machine is
gone — can a stranger, holding only what is stored remotely, get this running,
understand it, change it safely and carry it on? It cloned the GitHub copy into a
scratch folder and followed only the written docs.

**What passed, and it is the headline:** clone → `npm install` → 277 tests →
guardrails → typecheck → `npm run dev` serving a page, in **19 seconds**. The
README's central promise — installing the library into a fresh app straight from
GitHub — also worked, with zero test files in the shipped tarball.

**Where it stopped: deployment.** `DEPLOY.md` told the reader to run
`npm run changeset` and `npm run release`. Neither script has ever existed, there
is no `.changeset` and no `release.yml`, and the file contradicted `OPERATIONS.md`
about how deploys actually happen. Worse, the literal `wrangler` command lived
only inside a Claude skill under `~/.claude` — **on the laptop, not in the repo.**

- [x] **`OPERATIONS.md` rewritten as the operational source of truth** — the real
      deploy commands, a rollback procedure with a **named trigger**, credentials
      inventoried **by name** (never by value), a "what to check when it breaks"
      list, the account inventory, and a section for whoever inherits this.
- [x] **`DEPLOY.md` replaced.** It now says plainly that its previous contents
      described a pipeline that was never built, and points at `OPERATIONS.md`.
- [x] **Reproducibility pinned.** `.nvmrc` + `engines: node >= 20` (CI already ran
      20; nothing in the repo said so), a README prerequisites table, and a
      devcontainer.
- [x] **One verify command.** `npm run verify` = typecheck + tests + guardrails +
      format, replacing four commands scattered across four documents.
- [x] **Ownership and licences.** `CODEOWNERS`, a named maintainer in
      `package.json` (`author`, `repository`, `homepage`, `bugs`), and `NOTICE.md`
      acknowledging the shadcn/ui derivation and every dependency licence.
- [x] **100% of source files now open with a line saying what they are for** —
      154 of 154, up from 38%. Not filler: each says what the file is and, where
      one exists, the reason it is shaped that way (Button's
      `[&_svg]:pointer-events-none` trap, Badge's fill-vs-text contrast pairing,
      Card's `min-w-0`).

**Found while writing `NOTICE.md`:** `react-leaflet` is licensed
**Hippocratic-2.1**, not MIT — a non-OSI licence with use restrictions, and it is
a direct dependency, so every consumer inherits it. Documented along with the
unmade decision (moving it to optional `peerDependencies`) rather than left for
someone's legal review to discover.

No component behaviour changed. The full report is `ocean-review.md` /
`ocean-review.html`. The remaining 3 points need a second contributor (truck
factor) and a second remote copy — neither is buyable with documentation.

---

## 🪟 Windowed rendering in the collections (v0.10.0)

A scaling review found the last open item on client data volume: the host's cache
already caps at 2,000 rows and pages by keyset, so the **data** side is bounded —
but the collections rendered every loaded row, so a 2,000-row screen put 2,000
nodes in the DOM. Raised here rather than worked around in the app, because the
host's rule is that a primitive is never forked.

- [x] **`List`, `CardGrid` and `DataTable` now window their rows.** Only the
      visible slice plus an overscan buffer is mounted; the rest becomes
      equivalent empty space, so total height, scroll position and the scrollbar
      are byte-for-byte what they were. 2,000 rows → ~30 nodes.
- [x] **The props API did not change.** Windowing turns itself on past **100
      rows** and is otherwise inert, so no host recipe needs an edit to get it.
      The only new prop is an optional `virtualize` escape hatch (`false` for a
      view that must contain every row — printing, select-all, find-in-page).
      Adding a required config field would have broken every call site, and
      `XConfig` fields are all-required by rule — so this is a prop, not config.
- [x] **No fixed height, and no scroll container to supply.** The hook finds
      whichever ancestor is already scrolling and falls back to the page, so a
      collection in an ordinary page-scrolled layout keeps behaving exactly as it
      looks. Imposing our own bounded scroller would have been a visible layout
      change on every existing screen.
- [x] **Row pitch and column count are MEASURED, not configured.** Pitch (not
      height — it has to include the grid gap) and the live column count are read
      off the rendered DOM by finding the first child that starts a new visual
      row. That is what lets one hook serve a 1-column list, a table body, and a
      grid whose column count changes at every breakpoint, with no prop to keep
      in sync. It re-measures on resize.
- [x] **One hook, three layouts.** `lib/virtual.ts` holds the DOM-free
      arithmetic; `registry/primitives/use-virtual-rows` measures and subscribes.
      Each collection applies the same numbers the way its own layout demands:
      padding for the list (a spacer `div` would take a `divide-y` border and
      paint a stray rule) and the grid (a spacer would occupy a grid track and
      shift every later card by a column), spacer **rows** for the table (padding
      on a `tbody` is not rendered in table layout).
- [x] **Degenerate input renders everything rather than guessing.** An unmeasured
      pitch, a non-finite viewport, a zero-height container — each falls back to
      the full list. A complete collection is always correct, just slower; a
      wrong window is a bug you can see.

51 new tests (`lib/virtual.test.ts`, `use-virtual-rows.test.tsx`,
`virtualization.test.tsx`), and **every one was mutation-checked**: removing the
scroll listener, disabling column detection, counting spacers as rows, ignoring
the threshold, dropping the table's top spacer, and striping by the sliced index
each turn tests red. Two of those tests were vacuous on the first pass and were
rewritten until they failed — the stub had to model a spacer that occupies real
space before it could catch anything. jsdom has no layout engine, so geometry is
stubbed and real scrolling stays a manual browser check; both test files say so.

One subtlety worth recording: `DataTable` stripes by the **absolute** row index.
The sliced index would restart the zebra pattern at every window, so stripes
would visibly invert as you scrolled.

---

## 🔎 Legend labels + dark-mode fill labels — the last two contrast gaps (v0.9.6)

Two gaps the v0.9.5 audit could not see, both found by measuring the **rendered
page** rather than our own JSX.

**1 · Recharts was colouring legend labels for us.** The chart palette was audited
as graphics-only and set to the 3:1 floor on that basis. But Recharts colours its
legend **label text** with the series colour by default — putting `--chart-2` into
12px text at **3.05:1** and `--chart-1` at **4.07:1**, with nothing in our source
asking for it. `Chart` now pins the legend label to `--muted-foreground`; the
swatch keeps the series colour, so the chart still reads as colour-coded. This is
now **trap 4** in the re-skin checklist: _a dependency can turn your fill token
into text without you writing a line._

**2 · Dark-mode labels on filled controls.** Dark brand fills are **lighter** than
their light-mode counterparts, so the near-white label that works in light mode was
wrong here: **3.30:1** on `--primary` and **2.77:1** on `--destructive`. Both now
carry the near-black foreground that dark `--success` and `--warning` always used —
**5.20:1** and **6.19:1** — which also makes the four filled controls consistent
with each other for the first time.

Also fixed while in there: the chat timestamp used `text-primary-foreground/70`,
which at 10px measured **2.6:1** (light) and **2.3:1** (dark) against the bubble
fill. It now runs at full opacity — the size difference already carries the
hierarchy.

Guard: `chart.test.tsx` asserts the legend label resolves to the text token.
Proven able to fail — deleting the `formatter` prop turns it red.

Verified on the rendered gallery in both modes: 869 text nodes, **zero real
failures**. The only flagged nodes are white/near-black labels on the primary
**gradient** button (4.78–5.20:1, computed) and a cover-image title sitting on a
`from-black/75` scrim — both invisible to a checker that only reads
`background-color`.

---

## 🎨 Re-skin contrast checklist + the last three contrast gaps closed (v0.9.5)

A fork of this library re-skinned it by changing **only** the token values and the icon set
— 5 lines of visible text differed across three pages — and shipped **209 failing-contrast
text nodes** in light mode against our 39 on the identical page. Worst case: a pale-yellow
`--primary` at **1.30:1**, because `--primary` is what `article-body` renders **link text**
in. Everything needed to prevent that existed only as a comment in `styles.css`.

- [x] **`registry/tokens/README.md` now carries a RE-SKIN CONTRAST CHECKLIST** — which
      tokens carry a floor, which floor each carries and why, which are text vs fills, three
      traps, and a paste-in browser-console snippet that prints pass/fail per token. It uses
      **canvas rasterisation**, because a naive `oklch()` string parse of `getComputedStyle`
      output gets the numbers wrong. **Linked from README.md in two places** — a forker
      reads the README, not our token comments — and it ships inside the package.
- [x] **`--muted-foreground` darkened `0.556` → `0.525` (`#6a6a6a`).** The trap it
      illustrates: measured against `--background` it read a comfortable 4.73:1 and looked
      fine. Measured against the surfaces it _actually_ sits on, 5 shipped components failed
      — a hovered list row (**4.14:1**), chat-bubble timestamps, an inactive tab, and the
      command-menu shortcut hint (4.24–4.35:1). Now 4.71:1 on the worst of those, 5.39:1 on
      white. 198 of 207 nodes were always fine; the 9 that weren't are invisible to a check
      against the page background.
- [x] **New `--warning-strong` token (`#946a00`, 4.88:1) for warning TEXT.** `--warning`
      is a **fill**: a badge/stepper background carrying near-black `--warning-foreground`
      at 9.33:1, which is fine and is the amber accent identity. As _text_ on a light
      surface the same amber is **1.92:1**. `data-preview-table` used `text-warning` for the
      issue count and its warning icon; both now use `text-warning-strong`. Darkening
      `--warning` itself would have fixed the text and broken the badge.
- [x] **`--chart-5` darkened `0.7` → `0.64` (`#47a34e`, 2.52:1 → 3.17:1)** — it was under
      the 3:1 graphics floor this library sets for itself, on pie slices and calendar dots.
- [x] **Regression guards for the two bugs that had none.** `min-width: auto` has caused
      three bugs here and the chart-shrink bug shipped twice. `card.test.tsx` and
      `chart.test.tsx` cover them, and **both were proven able to fail** — reverting the
      fixes turns 5 tests red. jsdom has no layout engine, so the Card guard is a class
      contract and the chart guard drives a controllable `ResizeObserver` by hand; both
      files say so at the top, so nobody "improves" them into tests that cannot fail. Real
      pixel reflow remains a manual browser check — stated plainly rather than implied.
- [x] **The catalog drift guard skipped anchored links.** `[x](file.md#section)` never
      matched its regex, so deep links to non-existent files went unchecked. Fixed.

Dark mode was not touched: `--warning-strong` is _added_ there (11.5:1) so the utility
resolves in both themes, and no existing dark value changed.

---

## 🐞 Fixed — Card couldn't shrink, chart amber over-darkened, stale token paths (v0.9.4)

Three follow-ups from the v0.9.2/0.9.3 review. All three reports were correct; one of the
supporting numbers wasn't.

- [x] **The real cause of the sideways scroll was `Card`, not the chart.** v0.9.2's
      `min-w-0 + overflow-hidden` on the chart wrapper was right but one level too low: a
      `Card` is almost always a grid/flex item, and such an item defaults to
      `min-width: auto` — it refuses to shrink below its widest child, so one wide child
      pinned the Card open and the PAGE scrolled. Fixed on the **Card primitive** so it
      can't recur wherever something wide lands in a Card. Verified: drag desktop → 375
      with no reload now gives `scrollWidth 375`, overflow 0 (production: 11px).
- [x] **Same root cause explained the "new" 11px fresh-load overflow on `/`.** Measured on
      production: the offending node was the Card at `min-width: auto`, right edge 386 vs
      a 375 viewport. One fix, both symptoms — it was never a second bug.
- [x] **`--chart-2` restored toward amber; `--chart-1` reverted outright.** The chart
      tokens are **graphics** — chart areas, rating stars (`fill-chart-2`), calendar dots
      — never text (chart axis/legend text uses `muted-foreground`). So the bar is WCAG
      1.4.11 non-text contrast at **3:1**, not the 4.5:1 text bar, and darkening them to
      4.5:1 turned the amber accent to ochre for no accessibility gain. `--chart-1` goes
      back to its original `#0d8d82` (4.08:1 — it always cleared 3:1, so v0.9.2 changed it
      for nothing). `--chart-2` goes to `#ce8300` (3.06:1) rather than all the way back:
      **the original `#f49f1e` was 2.13:1 and failed even the 3:1 graphics floor.**
      `--primary` and `--success` stay at 4.5:1 — those two ARE used as text. The split is
      now documented in `styles.css` so neither side gets "fixed" back.
- [x] **Stale token paths purged, and guarded.** HANDOFF said tokens resolve from
      `www/app/globals.css`; they resolve from root `styles.css` (globals.css is a 3-line
      shim that imports it). That one stale line sent a debugging session at the wrong
      file. Same drift found and fixed in **ARCHITECTURE.md** (3 places, plus a directory
      map still showing `app/` instead of `www/app/` and two stale `.mdx` claims) and
      **registry/tokens/README.md** (2 places, including a link that resolved nowhere).
      Two new tests now fail the build if a markdown link points at a missing file, or if
      any doc claims the tokens live in globals.css.

## 🧹 Maintenance — audit pass: split, drift guards, doc corrections (v0.9.3)

No component behaviour changed. Four audits run (health, security, docs-story, errors).

- [x] **`filter-bar.tsx` split 551 → 206 + 173 + 202** — `RangeFacet` and `SearchableFacet`
      now live in their own files beside `FilterBar`, one component each. Behaviour
      identical; all 26 filter-bar tests still pass.
- [x] **Stale doc counts corrected + guarded.** README and HANDOFF both still claimed
      "88 components (62 primitives + 26 collections)" while `registry.json` had grown to
      90 (64 + 26); README also still told users to pin **v0.7.0** and claimed "100+
      tests". All corrected, and a new test in `catalog-sync.test.ts` fails the build if
      any prose count drifts from `registry.json` — verified by breaking a count on
      purpose.
- [x] **Security sweep: no findings.** Four XSS candidates were checked and all refuted —
      the `template.innerHTML` in Notes is the inert-parse idiom _inside_ the sanitizer
      (which strips every attribute), and both `article-body` hrefs are `safeHref()`
      results. `sharp` (3 high, libvips) enters only via `www → next`, is not a library
      dependency, and is unreachable in a static export (`images.unoptimized`); no
      non-breaking fix exists, so it was **not** forced.
- [x] **Error analysis: no error store exists, correctly.** There is no server runtime —
      the docs site is a static export, so there are no routes, workers or DB to record
      errors. The real error surface (the browser console on both deployed pages) is
      clean: 0 errors, 0 failed requests, all assets 200.
- [x] **Health: 94/100 (A).** Five of six dimensions ≥94; Size & Scope is 91, held down
      entirely by the showcase site (`components/page.tsx` 2431, `_data.ts` 1275,
      `documentation/page.tsx` 956 — ~24% of the codebase, none of it shipped). The split
      is written up as the top fix-list item rather than rushed into this pass.

## 🐞 Fixed — docs drift, light-mode contrast, chart resize (v0.9.2)

Three findings from an audit of the live site. All verified independently before changing
anything — two of the reported numbers needed correcting (below).

- [x] **Docs catalog was 6 entries behind registry.json** (85 vs 91). Confirmed the 13
      unmatched names, then classified each: **Select, Toggle, Toggle Group, Command,
      Stopwatch and Table** are genuinely user-facing (each has its own gallery demo card)
      and are now documented — they were demoed but unfindable from docs search.
      `visibility`, `use-debounce`, `label` and `sonner` are internal/renamed, and
      `calendar-view` / `detail-view` / `stat-grid` were already documented under
      friendlier names. **Table was NOT on the reported "looks real" list**, but it has a
      dedicated "Table (primitive)" demo, so it counted.
- [x] **Drift can't repeat: `registry/catalog-sync.test.ts`.** The catalog stays
      hand-written (the prose is worth it) and a test now fails when the two lists
      disagree. Every registry entry must be documented or declared exempt _with a
      reason_; a second test keeps the exemption list honest so it can't become a hiding
      place. Adding a component now fails CI until it's documented.
- [x] **Light-mode contrast now meets AA (4.5:1).** Darkened `--primary`, `--chart-1`,
      `--chart-2` and `--success` — lightness/chroma only, **hue unchanged**, so the teal
      brand identity is intact. Measured in-browser after the change: 4.63 / 4.63 / 4.59 /
      4.58 (all pass). `--ring` was left behind at the old value despite its own "RING
      follows PRIMARY" comment — synced. Dark mode untouched and still clean (5.7–10:1).
      **Two corrections to the report:** the tokens live in `styles.css` (the shipped
      theme), not `www/app/globals.css` — that file only imports it, so editing it would
      have done nothing; and the two chart values quoted were the **dark-mode** tokens
      (light `--chart-2` was 2.13:1, not 1.99:1). The failures were real either way.
- [x] **Chart shrinks as well as grows.** Reproduced: dragged 1280 → 375 without
      reloading and the chart stayed 942px while its parent went to 293px, pushing
      `scrollWidth` to 983. Fixed with `min-w-0` + `overflow-hidden` on the wrapper (a
      flex item's default `min-width: auto` refuses to shrink below its content) plus a
      `window.resize` fallback beside the ResizeObserver, and measuring `clientWidth`
      rather than the observer's `contentRect`. Verified: no page overflow at 375, and
      the chart re-measured 942 → 340 to fit a clamped container.
      **Harness note:** neither the preview pane nor a CDP-driven background tab delivers
      ResizeObserver callbacks or `resize` events (measured: 0 of each while the viewport
      changed), so the re-measure had to be proven by dispatching the event directly.

## 🐞 Fixed — the ✕ on an active filter opened the dropdown instead of clearing (v0.9.1)

Patch. No API change, no host change needed.

- [x] **The clear ✕ never received the click at all** — it was a bare `<X>` svg nested
      inside the trigger `<Button>`, and Button's base class carries
      `[&_svg]:pointer-events-none` (button.tsx:8), which removes every descendant svg
      from hit-testing. The browser hit-tested straight through to the Button, whose
      onClick Radix composes with `onOpenToggle`, so the popover opened and the user had
      to unselect values one at a time. The ✕'s own `preventDefault`/`stopPropagation`
      was dead code — not an event-bubbling problem.
- [x] **Fix: the ✕ is now a real sibling `<button>`**, outside the trigger, mirroring the
      pattern the plain-select and chips facets already used correctly (which is why
      those two always worked). Fixed in **RangeFacet** and **SearchableFacet**.
- [x] **Also fixed the same bug in `Choice`'s own `clearable` ✕** (choice.tsx) — not in
      the original report, found while auditing for the pattern. A `clearable` Choice
      could not be cleared, which also affects hosts using Choice directly.
- [x] **Accessibility hole closed** — the old ✕ was `aria-hidden`, unfocusable and had no
      keyboard path. The replacements are real buttons with an accessible name
      (`Clear <label>` / `Clear selection`) and a focus stop.
- [x] **Regression guard across ALL FOUR control types** (`select`, searchable `select`,
      `select` auto-promoted past `SEARCHABLE_THRESHOLD`, `range`, plus `chips`) — because
      a facet that merely GROWS past the threshold silently migrates into a different
      control implementation without the host changing a line. The assertions are
      structural (a real, named, focusable button outside the trigger), because jsdom does
      no hit-testing: a click-based test passes against the broken code and proves
      nothing. Verified by reverting the fix — 5 tests fail, then pass again.
- [x] `NOT` fixed by removing `[&_svg]:pointer-events-none` (load-bearing for every icon
      button) or by patching `pointer-events-auto` onto the ✕ (defeats the symptom, leaves
      it keyboard-unreachable).

## ✅ Built — host-reported primitive fixes: dialogs, ring shape, truncation, tab badges (v0.9.0)

Six verified host findings fixed at the primitive level. All additive — no host code
breaks by upgrading; two items need host opt-in to take effect (marked ⚙).

- [x] **⚙ Dropdown lists scroll inside dialogs.** A popover is portaled to `<body>`, so
      one opened inside a Dialog sat OUTSIDE the dialog's subtree and the dialog's scroll
      lock (react-remove-scroll) preventDefaulted its wheel/touchmove — typing worked,
      scrolling was dead. `Popover` already forwarded Radix's `modal` (it's Root
      verbatim); nothing passed it. Added a `modal` prop to **Choice**, **FilterBar**,
      **SortControl** and **CollectionFrame** (default `false`, so in-page controls keep
      click-through). Hosts set `modal` on controls that can appear in a Dialog/Sheet.
- [x] **Required-ring is no longer shape-blind.** `.required-ring` had a hard-coded
      rectangle radius, so it double-bordered rounded triggers and drew a gold rectangle
      around gap-separated pill/chip groups. The radius is now inheritable
      (`--ss-ring-radius`), and `Field` takes **`shape: "input" | "pill" | "group"`** —
      `group` drops the ring entirely and lets the label asterisk carry "required".
      Text inputs are untouched. The duplicated rule in `collections/form/form.tsx` is
      documented against the same vocabulary so it can't drift.
- [x] **Truncation floor — never shear letters.** Choice's trigger span was
      `overflow-hidden` with no `truncate` and no `min-w-0`, so it hard-clipped
      mid-letter ("INR — Indian F"). Now `min-w-0` + `truncate` + a `title` for the full
      text. Added a global `::placeholder` ellipsis rule (a pseudo-element `truncate`
      can't reach). Filter-bar popover + select triggers gained `max-w-[14rem]` so their
      existing `truncate` actually engages.
- [x] **⚙ `ChoiceOption.triggerLabel`** — a short label for the CLOSED trigger only
      ("INR") while the menu keeps the full name ("INR — Indian Rupee"), so the control
      never truncates at all. Falls back to `label`.
- [x] **StatusStepper's active ring no longer clips.** The `<ol>` was `overflow-x-auto`;
      per CSS that computes overflow-y to `auto` too, making it a scroll box in BOTH axes
      and shearing the active pill's `ring-2 + ring-offset-2` (~4px outside the pill).
      Scroll moved to the wrapper; the list is `overflow-visible` with vertical padding,
      so the ring survives at any root font-size (hosts run up to 107.5%).
- [x] **⚙ `RecipeTab.badge` + `badgeVariant`** — recipe tabs can carry counts;
      `screen-renderer` passed a hardcoded `badge: ""`. `badgeVariant` is typed to the
      Badge variant union (not `string`) so an unknown tone fails at compile time.
- [x] **Per-facet clear in FilterBar.** Clearing ONE active facet meant "Clear all" and
      rebuilding the rest. Searchable/range facets already had a ✕; the plain `select`
      facet now gets one too (Radix Select has no native clear). "Clear all" is unchanged.
- [x] **FIX found while verifying the above (pre-existing, also hit "Clear all"):** a
      cleared select facet kept _displaying_ its old value. Two causes: the Select was
      handed `undefined` when empty, which switches it to UNCONTROLLED; and even
      controlled with an empty string, Radix's `SelectValue` caches the chosen item's
      text node, so clearing never restores the placeholder. Fixed by passing the value
      through as-is plus remounting on the set↔empty transition. **jsdom does not
      reproduce this** (it shows the placeholder either way — both branches probed), so
      there is no unit test: it is verified in a real browser on staging instead, and the
      reasoning is recorded in the code and the test file so nobody "adds the missing
      test" and gets false confidence.

## ✅ Built — creatable Choice (type a value that isn't in the list) (v0.8.0)

Additive, backward-compatible (package bumped 0.7.1 → 0.8.0). Opt-in; every existing
options-only `Choice` is byte-for-byte unchanged.

- [x] **`ChoiceConfig.creatable`** — when the trimmed search matches no option, a
      "create" row appears at the top of the list (`dropdown` + `chips`; `pills` has
      no input). Selecting it uses the typed value through the normal
      `onChange(value: string[])` — no new required callback.
- [x] **`ChoiceConfig.createLabel`** — the row's label; `{query}` → the trimmed search
      text. Default `Add "{query}"`. Rendered as escaped React text.
- [x] **`onCreate?(value)` prop** — fires alongside `onChange` so a host can persist the
      new value as a real option (e.g. write to a table). Opt-in; a host that reconciles
      from `value` alone ignores it. Never fired for a value matching an existing option.
- [x] **Trim + dedupe** — a typed value that (case-insensitively, after trim) equals an
      existing option selects that option instead of a near-duplicate.
- [x] **XSS-safe** — the created value renders as escaped text, never HTML (hostile-input
      test included). The create row survives cmdk's own text filter via `forceMount`, so
      it shows whenever we've decided it should, regardless of query whitespace.
- [x] Six new tests (create / template / dedupe / off-by-default / XSS / multi-accumulate);
      live gallery demo "Choice · creatable (type a new value)" whose `onCreate` persists
      the value as a new option. Verified on staging at 375 / 768 / 1710 px.

## ✅ Built — release hygiene: tags, clean package, honest install docs (v0.7.1)

Packaging + docs only, no component changes. Fixes how consumers **get** the library.

- [x] **Every release is now a git tag** (`v0.1.0` … `v0.7.1`), each verified against the
      `package.json` at that commit. Before this, version numbers were labels only —
      nothing was pinnable and `#v0.7.0` would have failed. Apps can now pin:
      `npm install github:alaap-swift-struck/swift-struck-ui#v0.7.1`.
- [x] **Tests no longer ship to consumers** — the tarball carried **27 `*.test.tsx`**
      files importing `vitest`/`@testing-library` (devDeps a consumer doesn't have),
      against our own "devDeps never ship" rule. `files` now excludes `**/*.test.*`:
      136 → 109 files, 126 kB → 108 kB. All 90 components still ship.
- [x] **`publishConfig.access: "public"`** — a scoped package is private by default on
      npm, so `npm publish` would have failed without it.
- [x] **README tells the truth about updating** — a bare `npm install` reuses the commit
      SHA locked in `package-lock.json`, so an app can sit on stale code while looking
      current. Documented `npm update` / `#vX.Y.Z` and `npm ls` to check what you have.
- [x] **Documented `transpilePackages`** — the library ships `.tsx` source and Next.js
      doesn't compile `node_modules` by default, so a fresh install failed on the first
      import with no explanation. (The docs site never caught this: `www` compiles the
      library from the repo root via `externalDir`, so it never exercises the real
      `node_modules` install path.)

## ✅ Built — in-header sort control + scannable list rows (v0.7.0)

Additive, backward-compatible (package bumped 0.6.0 → 0.7.0). Driven by a host that
hand-built each of these first and hit the wall — so each one encodes a real bug.

- [x] **New `sort-control` primitive** — a field picker + an asc/desc toggle, rendered
      **inside** the CollectionFrame header on the same row as search and the filters
      (and folded into the mobile popover, whose trigger becomes "Filters and sort").
      The picker is composed from `Choice`, so past 8 options it searches itself for
      free — no second combobox implementation.
- [x] **Three rules baked into `SortOption`**: per-option **`defaultDir`** (picking a
      date field gives newest-first, not oldest-first) · **`directionless`** (best-match
      relevance **disables** the toggle instead of silently ignoring it) · and no
      selection = no axis to flip, so the toggle is disabled there too.
- [x] **`sortable` + `sortOptions` on `CollectionConfig`**; `sortBy`/`sortDir` stay the
      **declared initial** sort while the user's live pick is runtime state — the same
      split as builder `filter` vs user `facetValues`, so config stays declarative.
- [x] **One seam, not two** — sort is emitted through the EXISTING `onQueryChange`
      (`{query, facetValues, sortBy, sortDir}`), which is exactly the payload a
      server-side host turns into its next request. `serverSide` still never sorts in
      memory; it only emits.
- [x] **Select facets auto-upgrade to the combobox** past `SEARCHABLE_THRESHOLD` (8)
      unless `searchable:false` — opt-**out**, so a host can't accidentally ship an
      unsearchable 200-item dropdown.
- [x] **`ListItem.fields`** — label/value pairs under the subtitle, for rows you scan
      (code · price · height). Without it a row shows two fields, so sorting by a field
      the row doesn't display looks broken.
- [x] **FIX (found by the rule-engine sweep): numeric ops no longer match a blank field.**
      `Number("")` is `0`, so `gt`/`lt`/`gte`/`lte` treated an EMPTY field as zero — a
      product with no price appeared in a "price ≤ 5" filter, while a _missing_ price
      (NaN) correctly didn't. Blank, missing, non-numeric, and a non-numeric rule
      `value` now all fail, matching SQL's NULL semantics so the in-memory result
      agrees with the D1/SQL layer. A real `0` still compares as `0`. Predates v0.6.0
      (`gt`/`lt` had it); the range facet is what made it reachable from the UI.
- [x] Verified on staging at 375 / 768 / 1710 px, no horizontal overflow.

## ✅ Built — numeric range facet + placeholder ellipsis (v0.6.0)

Additive, backward-compatible (package bumped 0.5.1 → 0.6.0). Select/chips facets unchanged.

- [x] **Placeholders never hard-truncate** — the `Input` primitive is now `truncate`, so an
      overflowing value **or placeholder** ends in an ellipsis: "Search attributes…" degrades
      to "Search attr…", never "Search attribut". Every shipped text input inherits it
      (SearchInput, Field-wrapped inputs).
- [x] **`FilterFacet.control: "range"`** — a numeric min/max facet with optional
      `min`/`max`/`step`. With **both** bounds it renders a two-thumb `Slider`; otherwise two
      number inputs (so an open-ended field still filters). Reports a compact `"min..max"`
      through the EXISTING `onChange` (`"10.."` / `"..20"` one-sided, `""` = cleared), so it
      rides the `filterFacets` array with no new CollectionFrame plumbing.
- [x] **Rule engine gained inclusive `gte`/`lte`** — `selectRows` compiles a range facet to
      them, so `"10..20"` keeps `10 ≤ field ≤ 20`. The facet's `control` is looked up, never
      guessed from the value's shape, so a select value containing ".." still matches
      literally. (One matching engine still — no parallel numeric filter.)
- [x] **`Slider` renders one thumb per value** — the same primitive now covers a single value
      and a two-thumb range.
- [x] **`lib/range.ts`** — shared `parseRange`/`formatRange`, in `lib` because both the
      FilterBar primitive and `selectRows` need them (a primitive may import lib; lib may
      never import a primitive). Covered by 16 new tests; verified on staging at 375 / 768 /
      1710 px with no horizontal overflow.

## ✅ Built — shared debounce hook, DRY cleanup (v0.5.1)

Internal refactor, no API change (package bumped 0.5.0 → 0.5.1).

- [x] **New `use-debounce` primitive** — `useDebouncedCallback(fn, delay)` is now the
      one debounce the library shares (`delay <= 0` fires immediately; latest `fn` kept
      in a ref; cleared on unmount). Registered in `registry.json`.
- [x] **SearchInput and FilterBar's async facet both route through it** — the two
      hand-rolled `setTimeout` debounces are gone. Covered by a focused hook test; the
      existing SearchInput + facet tests still pass unchanged.

## ✅ Built — searchable / async filter facets (v0.5.0)

Additive, backward-compatible (package bumped 0.4.0 → 0.5.0). Opt-in per facet; no app change required — a recipe supplies the provider.

- [x] **`FilterFacet.searchable?: boolean`** — renders a `control:"select"` facet as
      a searchable **combobox** (Command + Popover) instead of a plain dropdown. Off →
      the existing `<Select>` renders unchanged.
- [x] **`FilterFacet.onSearch?: (field, query) => Promise<{value,label,count?}[]>`** —
      async option provider. Fires debounced (200ms) as the user types; the resolved
      rows **replace** the visible list (with an optional muted `count`), so a facet
      with thousands of values is searchable without ever loading them all. `options`
      shows before the first keystroke. A request counter drops stale responses.
- [x] **Free threading** — both `CollectionFrame` and `FilterBar` already pass the whole
      `filterFacets` array, so the two fields ride along with zero new props.
- [x] Covered by two new tests (client-filter + async paths); documented in
      CONFIG-REFERENCE; live gallery demo "List · searchable async facet".

## ✅ Built — mobile-header + wrap fixes (v0.3.0)

- [x] **AgentChat ToolRow label wraps** instead of truncating — `items-start` +
      `break-words` keep the status dot/word on the first line while the label wraps
      (phone-friendly; the full step label is readable).
- [x] **CollectionFrame header goes compact on phones** — below `sm` it's ONE row:
      a stretching search field (with the live count folded into its placeholder) + a funnel button that opens the same FilterBar in a popover (with an active
      dot when a filter/search is on). ≥`sm` is unchanged. Pure Tailwind `sm:`
      breakpoints; covered by a mobile-branch test.

## ✅ Built — host-app additive tweaks (v0.2.0)

Three backward-compatible changes for a consuming app (package bumped 0.1.0 → 0.2.0):

- [x] **AgentChat composer auto-grows** — expands to fit typed lines up to the
      existing max-h cap (then scrolls), and resets to one row on send. No API change.
- [x] **CollectionFrame `headerLayout: "stacked" | "inline"`** (default `"stacked"`,
      so existing consumers are unchanged) — `"inline"` puts title + search + filters
      on one wrapping row. Added to `CollectionConfig` + default + CONFIG-REFERENCE.
- [x] **ScreenRecipe `surface?: "card" | "none"`** threaded to the list-recipe
      `<List>` (omit → List's own `"card"` default, so nothing reflows) — lets a host
      that wraps the collection in its own Card avoid a card-in-card.

---

## ✅ Built — agent/app surfaces, screen engine, hardening & tests (recent batches)

- [x] **Agent & app surfaces** (prop-driven, flat, dark-mode): `agent-chat`,
      `copilot-overlay`, `run-steps`, `data-preview-table`, `import-wizard`,
      `ticket-thread` (with an optional in-thread status dropdown via
      `showStatusControl`), plus learning: `article-body`, `progress-toggle`,
      `progress-dashboard`.
- [x] **Config-driven screen engine** — `lib/recipe.ts` → `screen-renderer`
      composes serializable recipes (list/detail/edit/add/confirm/custom) from
      collections, with permission gating and a deep-link URL grammar.
- [x] **Record-detail building blocks** — `description-list`, `activity-feed`,
      `record-detail`; plus `collection-frame`, `search-input`, `filter-bar`,
      `breadcrumbs`.
- [x] **`status-stepper`** (primitive) — left-to-right lifecycle stepper with a
      colour tone per stage; clickable to change status. The host control that
      pairs with `TicketThread`'s `showStatusControl={false}`.
- [x] **Security hardening** — one shared `safeHref` guard (`lib/url.ts`,
      http/https/mailto only) used by ArticleBody, TicketThread, Breadcrumbs, and
      WebEmbed; the Notes editor sanitizes seeded HTML (allow-list, no
      `dangerouslySetInnerHTML`); the WebEmbed iframe is sandboxed.
- [x] **Test suite** — vitest + React Testing Library + jsdom: pure logic
      (config engine, collection pipeline, screen recipe, progress math, the URL
      guard, the Notes sanitizer), component rendering (breadth smoke), key
      interactions (stepper click, ticket toggle), and XSS regressions; all in CI.

---

## ✅ Built — Glide-parity gallery revamp (this batch)

- [x] gallery regrouped into Glide-mirrored sections (Collections · Display ·
      Inputs & Pickers · Actions · Layout · Navigation · Overlays)
- [x] Fields (detail-view) & Big Numbers (stat-grid) moved out of Collections
      into Display — they show ONE record, so they're Components, not Collections
- [x] every demo is a configuration with its own ⚙ (53 live editors), via a
      keyed knob store + `VariantGroup` helper (no per-card state hooks)
- [x] `collection-frame` — one shared chrome: title + live "Showing X of Y" +
      search + pagination (itemsPerPage) + total limit; powers List & Card
- [x] Card collection surfaced; List & Card seeded with 36 rows, paginated
- [x] required-ring fixed to hug only the input (Signature rings just its canvas)
- [x] `GLIDE-CONFIG-RESEARCH.md` — per-component Glide config reference

---

## ✅ Built

### Tokens & theming (3)

- [x] design tokens (teal/amber, light + dark)
- [x] theme-provider + mode-toggle
- [x] ambient-background (interactive gradient field)

### Primitives — form & input (10)

- [x] button
- [x] input
- [x] textarea
- [x] label
- [x] select
- [x] checkbox
- [x] radio-group
- [x] switch
- [x] slider
- [x] progress

### Primitives — display & feedback (8)

- [x] card
- [x] badge
- [x] avatar
- [x] separator
- [x] skeleton
- [x] alert
- [x] tooltip
- [x] table

### Primitives — navigation & structure (8)

- [x] toggle + toggle-group
- [x] breadcrumb
- [x] pagination
- [x] collapsible
- [x] scroll-area
- [x] aspect-ratio
- [x] sonner (toasts)

### Primitives — overlays & nav (6)

- [x] dialog
- [x] dropdown-menu
- [x] popover
- [x] sheet
- [x] alert-dialog
- [x] hover-card
- [x] command (⌘K)
- [x] tabs
- [x] accordion

### Configurable (config-driven) (2)

- [x] choice (single/multi · dropdown+search / chips / pills · max)
- [x] data-table (columns, types, sort, search, striped, density, row actions)
- [x] chart (bar/line/area/pie/radar/radial, multi-series, stack, animate)
- [x] kanban (config columns, group-by, card fields, drag between columns)
- [x] calendar-view (month grid, date/title/accent fields, week start)
- [x] detail-view (record fields, types, 1/2 columns)
- [x] stat-grid (big-number metric cards, columns, delta/trend)
- [x] checklist (tick items off, progress, strike completed)

### Primitives — content & actions (6)

- [x] rating (stars, configurable max, read-only)
- [x] action-row (icon + title/subtitle + trailing/chevron, tappable)
- [x] spinner (loading indicator, 3 sizes)
- [x] web-embed (responsive framed iframe)
- [x] spacer (fixed vertical gap)
- [x] typography (Headline / Text / Hint)

### Collections (2)

- [x] list
- [x] card-grid

---

## ✅ Built — media, inputs, forms & social (this batch)

- [x] title (hero blocks: simple/image/profile/cover)
- [x] image · video · map
- [x] date-picker · file-upload · signature · stopwatch · notes (was rich-text)
- [x] field (FieldConfig wrapper: label + required-ring + helpText + validation)
- [x] form (collection, config-driven + validation)
- [x] comments · chat (collections)
- [x] permission-matrix (collection: role access-rights grid — modules × Read/Create/Edit/Delete, auto-flip-read, edit/read/locked modes; pure logic unit-tested)

## ⬜ To build

### Nice-to-have / polish

- [ ] contact (trivial composition: action-row + avatar)
- [ ] data-table: column filters + pagination (base table done)
- [ ] extra primitives if needed: navigation-menu, context-menu, menubar,
      resizable, carousel, input-otp, drawer

### Foundations (architecture)

- [x] configuration system (per-component typed `config`, all fields required)
- [x] config playground (harness-only: per-component ⚙ live editor + search)
- [x] base config + visibility rule engine (lib/config.ts) on every
      configurable component; self-hide via useIsVisible + VisibilityProvider
- [x] component taxonomy documented (Input/Content/Action/Collection/Nav/Overlay/Layout)
- [~] adopt category mixins per component — FieldConfig adopted via the `field`
  wrapper (label/required-ring/helpText/validation); ActionConfig triggers and
  CollectionConfig filter execution still to wire
- [ ] visual rule-builder UI in the playground (rules editable as JSON today)
- [ ] workspace-package restructure (central propagation — chosen, next up)
- [x] automated tests — vitest + React Testing Library + jsdom: pure logic +
      component rendering + interactions + security regressions, run in CI
      (broaden per-component render coverage over time)
- [x] docs are ONE searchable source of truth (central showcase + catalog +
      CONFIG-REFERENCE); per-component `.mdx` was tried and dropped
