# Swift Struck UI — build progress

A running tally of the library. Updated each batch. No percentages — just
what's built and what's left.

> **Built: 68** &nbsp;·&nbsp; **To build: ~1** &nbsp;·&nbsp; _Glide parity complete · gallery restructured to mirror Glide (Collections / Display / Inputs & Pickers / Actions / Layout / Navigation / Overlays) · every demo card is one configuration with its own ⚙ · collections wear a shared frame (title + live count + search + pagination + limit)_

> **Glide config reference:** see `GLIDE-CONFIG-RESEARCH.md` — every component's real Glide config options, the source of truth for parity.

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
- [ ] per-component MDX docs (backfilled once the look is locked)
