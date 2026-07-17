# Swift Struck UI — build progress

A running tally of the library. Updated each batch. No percentages — just
what's built and what's left.

> **Built: 90 components** (64 primitives + 26 collections) &nbsp;·&nbsp; **Tests: 166 across 27 files** &nbsp;·&nbsp; _Glide parity complete · agent/app surfaces added · config-driven screen engine · status-stepper primitive · searchable/async/range filter facets · in-header sort control · shared debounce hook · library-wide XSS hardening · component + interaction + security test suite in CI._

> The live counts are authoritative from `registry.json` (components) and
> `npm run guardrails` ("N modules", which also counts logic + test files).

> **Glide config reference:** see `GLIDE-CONFIG-RESEARCH.md` — every component's real Glide config options, the source of truth for parity.

---

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
