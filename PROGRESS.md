# brimba — build progress

A running tally of the library. Updated each batch. No percentages — just
what's built and what's left.

> **Built: 33** &nbsp;·&nbsp; **To build: ~25** &nbsp;·&nbsp; _last updated: config system + Choice + DataTable_

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

### Collections (2)

- [x] list
- [x] card-grid

---

## ⬜ To build

### Primitives — remaining

- [ ] form (validation wiring)
- [ ] toggle + toggle-group
- [ ] input-otp
- [ ] calendar / date-picker
- [ ] sonner (toasts)
- [ ] navigation-menu
- [ ] breadcrumb
- [ ] pagination
- [ ] collapsible
- [ ] scroll-area
- [ ] aspect-ratio
- [ ] resizable
- [ ] context-menu
- [ ] menubar
- [ ] carousel
- [ ] chart (typed wrappers)
- [ ] drawer

### Collections — the Glide payoff (config-driven)

- [ ] data-table: add column filters + pagination (base table done)
- [ ] kanban
- [ ] calendar-view
- [ ] detail-view
- [ ] stat-grid
- [ ] gallery

### Foundations (architecture)

- [x] configuration system (per-component typed `config`, all fields required)
- [ ] workspace-package restructure (central propagation — chosen, next up)
- [ ] per-component MDX docs (backfilled once the look is locked)
