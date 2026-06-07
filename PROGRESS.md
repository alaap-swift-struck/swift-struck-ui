# brimba — build progress

A running tally of the library. Updated each batch. No percentages — just
what's built and what's left.

> **Built: 53** &nbsp;·&nbsp; **To build: ~9** &nbsp;·&nbsp; _last updated: Chart (bar/line/area/pie/radar/radial)_

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

## ⬜ To build

### Primitives — remaining

- [ ] form (validation wiring)
- [ ] input-otp
- [ ] calendar / date-picker
- [ ] navigation-menu
- [ ] resizable
- [ ] context-menu
- [ ] menubar
- [ ] carousel
- [ ] chart (typed wrappers)
- [ ] drawer

### Collections — the Glide payoff (config-driven)

- [ ] data-table: add column filters + pagination (base table done)
- [ ] comments + chat collections
- [ ] title/hero blocks (Simple/Image/Profile/Cover)

### Foundations (architecture)

- [x] configuration system (per-component typed `config`, all fields required)
- [x] config playground (harness-only: per-component ⚙ live editor + search)
- [ ] workspace-package restructure (central propagation — chosen, next up)
- [ ] per-component MDX docs (backfilled once the look is locked)
