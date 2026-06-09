# Glide config research — the source of truth for Swift Struck UI's config parity

Compiled from Glide's official docs (essentials + reference) on 2026-06-08 via four
parallel research passes. This is what every Swift Struck UI component's `config` should
expose. Where Glide's live docs are JS-rendered, fields were reconstructed from
reference/community sources and flagged. **Swift Struck UI may be a superset** (e.g. we keep
Big Numbers delta/trend even though Glide lacks it) — but we should never expose
_fewer_ knobs than Glide for a component we claim parity on.

---

## Part A — Taxonomy (this drives the gallery sections)

Glide splits the palette by **how much data a block shows**:

- **Components** = one record / one value (single-row).
- **Collections** = many rows (a list/grid/board).

**Confirmed placements (correct these in Swift Struck UI):**

- **Fields** (our `detail-view` / "record fields") → **Component**, NOT a collection.
- **Big Numbers** (our `stat-grid`) → **Component**, NOT a collection.
- **Checklist** → **Collection** (stays).
- All **inputs/pickers** (Entry, Choice, Checkbox/Switch, Date, File/Image, Rating,
  Signature, Scanner) → **Components**, in an Entry/Pickers area. Multi-field entry
  is wrapped by **Form Container**.

**Glide palette sections** (approximate header names — Glide renders a flat list in
docs, but these buckets are right): Layout · Text/Display · Fields · Buttons ·
Entry/Inputs · Pickers · Media · Location · Charts · Collections · AI.

---

## Part B — Shared collection config (EVERY collection gets these)

This is the big one — applies to List, Card, Table, Data Grid, Kanban, Calendar,
Checklist, Comments, Chat, Custom.

**Data**

- **dataSource** — table/relation feeding the collection.
- **title** — header text above the collection.

**Items Data** (column→display mapping; slots vary by type)

- **title / subtitle / meta / image** — per-item text + image columns.

**Filter / Sort / Group**

- **filter** — builder-side conditions (column · operator · value, AND/OR groups);
  can reference the signed-in user (per-user filtering).
- **sort** — order by a column asc/desc (default = row order).
- **groupBy** — group items into sections by a column.

**Options / pagination** (the two are SEPARATE — user called this out)

- **search** — toggle a search bar.
- **userFilter** — toggle runtime user-facing filtering.
- **itemsPerPage / pageSize** — how many render per page (pagination).
- **limit** — caps the TOTAL number of items shown (independent of page size).

**Visibility**

- **visibilityRules** — whether the whole collection renders (we already have this).

**Actions**

- **titleBarActions** — buttons in the header (e.g. add item).
- **itemClick** — action on tapping an item (show detail / form / custom).
- **itemActions** — per-item buttons/menu.
- toggles: allow add / edit / delete items.

**Design**

- **style / size / alignment** (vary by type) + custom CSS.

> Item count: Glide has no explicit "show count" toggle — but the user WANTS a live
> "showing X of Y" count that reacts to search/filter. This is a Swift Struck UI addition.

---

## Part C — Per-collection unique config

- **List** — items: title/subtitle/meta/image (text-forward). style/size.
- **Card** — items: title/subtitle/meta/image (image-forward). style: Float/Outline/None.
  size: Full (1/row) or Half (2/row). alignment.
- **Table** — columns (value/header/type/width). types: Text, Boolean, Image, Link,
  Button, Choice, Tag. design: Minimal | Striped. grouping. search/limit/pageSize.
- **Data Grid** — like Table + row markers (row numbers), 8 column types (adds Number).
- **Kanban** — items: title/description/image/tags. groups: value column → columns
  (+ custom title, save-order column). auto "Uncategorized". max 25 columns.
- **Calendar** — title, startTime (Date&Time), endTime (optional, defaults 30min),
  titleStyle: Simple|Bold, defaultMode: Month|Week|Day, defaultDate: Today|Earliest|Latest|custom.
- **Checklist** — title, checked (boolean column toggled on complete).
- **Comments** — comment/timestamp/userPhoto/userName, save column, unique-id (thread),
  empty screen, after-submit action. needs sign-in.
- **Chat** — text/timestamp/userPhoto/userName, save column, unique-id, empty screen, limit.
- **Custom Collection** — layout, grid size, background; build the item card from child
  components (reusable container).

---

## Part D — Per-component config

### Inputs / Pickers

- **Entry** (our `input`) — label, placeholder, dataSource, **size (single vs multi-line
  height — the text-box-size knob the user wants)**, minLength/maxLength (text),
  min/max (number), defaultValue, required, visibility. Variant sets keyboard:
  Text/Number/Phone/Email.
- **Choice** — writeTo, values, displayAs, images, **style: Dropdown | Chips | Radio**,
  allowMultiple, limitChoices, label, defaultValue, required. (Dropdown auto-searches >9.)
- **Checkbox and Switch** — column, label, description, style: Checkbox | Switch, required.
- **Date Pickers** — type: Date | DateTime, column, label, placeholder, required,
  dateRange: All | Past | Future.
- **File / Image Pickers** — dataSourceColumn, label, required; Image: source
  camera|camera+device, multiple; File: keep|generate name, multiple.
- **Rating** — saveTo, **maxRating 3–5** (read-only via computed/visibility, no toggle).
- **Signature** — column (image/text), title, **required** (no color/height knobs natively).
- **Fields** (our `detail-view`, a COMPONENT) — repeatable label+value pairs (each
  label/value = column or custom), add/reorder. Multi-column via wrapping Container.

### Content / Display

- **Text** (our typography) — source, style: Headline/Body/Caption/Quote, size, align,
  allCaps, truncate + lines (1–6).
- **Title** — style: Classic | Image | Cover | Profile, title, subtitle, size:
  S/M/L/XL, imageStyle: Rounded|Circle, background: Card/Accent/Dark/White/Image/None,
  backgroundImage, backgroundEffect: Darken/Lighten/None, blur.
- **Hint** — description, mood (info/success/warning/danger), icon, action.
- **Rich Text / Notes** — text/content source (Markdown), action; Notes also: textColumn
  (save), label, in-editor formatting.
- **Image** — source (upload/url/column), shape: Square|Circle, aspectRatio (Auto+fixed),
  size: Full|Small|Medium, align, openOnClick, altText, action.
- **Video** — url/column, aspectRatio, controls toggle, saveProgress. (YouTube/Vimeo/Loom…)
- **Map** — dataSource, address column, visualType: Street|Satellite, caption, itemClick.
  **Location** is separate (saveTo coords, label).
- **Big Numbers** (our `stat-grid`, a COMPONENT) — repeatable items: value, name,
  description; add/reorder; action. **Glide has NO delta/trend/prefix/suffix — Swift Struck UI
  keeps its richer version as a superset.**
- **Progress Bar** — value, min (0), max (100), title, description, colors (multi),
  hideValue, formattedValue.
- **Charts** — style: Bar/StackedBar/Line/Scatter/Area/StackedArea/Mixed/Radial(Pie),
  title, xAxisLabel, timeRangeSelector, values (multi-series via add item), colorScheme,
  yAxisLabels, legend, itemLimit; per-series caption/colorMode/colorValues.
- **Web Embed** — url/column, embedSize, scrolling toggle.

### Actions

- **Button** — style: Basic|Minimal|Tiles, width: Auto|Wide, accent, label show/hide,
  title, actions (multi). (Icon/confirm come from the action layer.)
- **Link** — linkTo (url column/custom), style: Compact|Row, title, icon, caption (Row).
- **Action Row** — text, label, image, textStyle: Title|Field, imageStyle: Square|Circle,
  action. (Chevron is automatic.)

### Layout / Nav / Misc

- **Container** — columnLayout (1..n), background: None/Card/Accent/Dark/Highlight/Image,
  padding: Normal/Large/XLarge, width: Large/Medium/Small, visibility (governs children).
- **Separator** — spacingSize: Small|Medium|Large, drawLine toggle.
- **Spinner** — size: Small|Medium|Large.
- **Tabs Container** — style: Line|Button, fullWidthOnMobile; holds child components.
- **Breadcrumbs** — no config (reflects screen titles).
- **Stopwatch** (Beta) — startTime column, duration column.

### Niche / out of scope (keep ➖)

- **Audio / Audio Recorder**, **Scanner** (paid/hardware), **Voice Transcription** (mic+AI),
  **AI Custom** (Beta, unsupported), **Dynamic Content** (JSON-driven render). Not core UI.

---

## Part E — What this means for Swift Struck UI (gap list)

1. **Re-categorize:** move `detail-view` (Fields) and `stat-grid` (Big Numbers) out of
   Collections into a **Components** section. Keep `checklist` a Collection.
2. **Collections need:** title + live count, `itemsPerPage` (paginate), `limit`,
   user-facing search/filter already partly there; seed 30–40 rows to show it.
3. **Add the Card collection** to the gallery prominently.
4. **Entry/input needs a `size`** (single/multi-line) knob — stop hardcoding it.
5. **Configs to add** (typed `XConfig`, all-required, + ⚙): typography(Text), title,
   hint, image, video, map, progress, web-embed, button, link, action-row, rating,
   signature, separator, spinner, container/card, tabs, input, checkbox, switch,
   date-picker, file-upload, notes, select, slider, badge, avatar, etc.
6. **Every gallery demo** shows its top 3–7 variants side-by-side, each with its own ⚙.
7. **Bug:** required-ring must hug only the input control, not the whole field block.
