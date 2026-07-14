# Swift Struck UI — build progress

A running tally of the library. Updated each batch. No percentages — just
what's built and what's left.

> **Built: 89 components** (63 primitives + 26 collections) &nbsp;·&nbsp; **Tests: 139 across 25 files** &nbsp;·&nbsp; _Glide parity complete · agent/app surfaces added · config-driven screen engine · status-stepper primitive · searchable/async filter facets · shared debounce hook · library-wide XSS hardening · component + interaction + security test suite in CI._

> The live counts are authoritative from `registry.json` (components) and
> `npm run guardrails` ("N modules", which also counts logic + test files).

> **Glide config reference:** see `GLIDE-CONFIG-RESEARCH.md` — every component's real Glide config options, the source of truth for parity.

---

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
