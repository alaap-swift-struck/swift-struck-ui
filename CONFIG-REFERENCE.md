# Config reference — every component, every setting

This is the organized, field-by-field reference for **how each component is
configured and what each setting does**. It's the human + AI map of the library:
read this (plus the typed configs in `lib/config.ts`, which carry the
same explanations as comments) and you know the whole surface.

## How config works (the model)

- **Every component starts from `BaseConfig`** (show/hide).
- **A category mixin** adds shared settings for that _kind_ of component:
  `FieldConfig` (inputs), `CollectionConfig` (data views), `ActionConfig`
  (actions), `ContainerConfig` (layout), plus media configs.
- **Then each component adds its own** settings (e.g. `ChoiceConfig`).
- **Every field is required** — there are no optional/hidden knobs. You always
  start from the exported `defaultXConfig` and override what you need:

  ```tsx
  import {
    Choice,
    defaultChoiceConfig,
  } from "@swift-struck/ui/registry/primitives/choice/choice"
  ;<Choice
    options={tags}
    value={v}
    onChange={setV}
    config={{ ...defaultChoiceConfig, mode: "multi", display: "pills" }}
  />
  ```

---

## Shared: `BaseConfig` (on EVERY component)

| Field             | Type      | What it does                                                                                                           |
| ----------------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `visible`         | `boolean` | Hard on/off. `false` → the component renders nothing.                                                                  |
| `visibilityRules` | `Rule[]`  | Conditional show/hide. The component renders only if **all** rules pass (see Rule below). Empty `[]` → always visible. |

### `Rule` (used by `visibilityRules` and collection `filter`)

| Field    | Type                                                                         | What it does                                                                        |
| -------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `source` | `"row" \| "user" \| "app"`                                                   | Where the value is read from: the current record, the signed-in user, or app state. |
| `field`  | `string`                                                                     | Which field on that source to check.                                                |
| `op`     | `"is" \| "isNot" \| "contains" \| "gt" \| "lt" \| "isEmpty" \| "isNotEmpty"` | The comparison. `gt`/`lt` compare as numbers; `contains` is case-insensitive.       |
| `value`  | `string`                                                                     | The value to compare against.                                                       |

---

## Inputs: `FieldConfig` (Input, Textarea, Field-wrapped inputs)

| Field        | Type              | What it does                                                                        |
| ------------ | ----------------- | ----------------------------------------------------------------------------------- |
| `label`      | `string`          | Field label above the input. `""` = no label.                                       |
| `helpText`   | `string`          | Muted hint under the input (hidden while an error shows).                           |
| `required`   | `boolean`         | `true` → shows the red `*` and the animated teal "required ring".                   |
| `disabled`   | `boolean`         | `true` → greys out and blocks input.                                                |
| `validation` | `FieldValidation` | The rules below; `validateField(value, config)` returns an error message or `null`. |

### `FieldValidation`

| Field                     | Type             | What it does                                                                                                                    |
| ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `min` / `max`             | `number \| null` | For numeric values: the smallest / largest allowed. `null` = no limit. (Only applied when the value is a plain decimal number.) |
| `minLength` / `maxLength` | `number \| null` | Fewest / most characters. `null` = no limit.                                                                                    |
| `pattern`                 | `string`         | A regular expression the value must match. `""` = no pattern.                                                                   |

---

## Data views: `CollectionConfig` (List, Card, Table, Kanban, Calendar…)

Declared here, **executed** by `CollectionFrame` (`selectRows`): `limit → filter
(builder + facets) → search → sort → paginate`.

| Field               | Type              | What it does                                                                                         |
| ------------------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `dataSource`        | `string`          | Name of the table/relation feeding the collection (used by the data layer).                          |
| `title`             | `string`          | Header above the collection. `""` = no header.                                                       |
| `filter`            | `Rule[]`          | **Builder-side** rules, always applied (per-row). User facets are ANDed on top (see `filterFacets`). |
| `sortBy`            | `string`          | Field to sort by. `""` = original order.                                                             |
| `sortDir`           | `"asc" \| "desc"` | Sort direction.                                                                                      |
| `limit`             | `number \| null`  | Cap on the **total** rows ever shown. `null` = no cap.                                               |
| `itemsPerPage`      | `number \| null`  | Rows per page (adds a Prev/Next pager). `null` = show everything, no pagination.                     |
| `scrollToTop`       | `boolean`         | On page change, `true` scrolls the collection's top back into view; `false` stays put.               |
| `searchable`        | `boolean`         | Show the debounced `SearchInput` that filters on the named keys.                                     |
| `searchPlaceholder` | `string`          | Placeholder inside the search box. Default `"Search…"`.                                              |
| `userFilter`        | `boolean`         | Show a runtime, USER-facing `FilterBar` of `filterFacets`. Separate from `searchable` and `filter`.  |
| `filterFacets`      | `FilterFacet[]`   | The facets rendered when `userFilter` is on (each a dropdown or chips). See below.                   |
| `showCount`         | `boolean`         | Show the live "Showing X of Y" count (updates with search **and** facets).                           |
| `emptyText`         | `string`          | Message shown when no rows match.                                                                    |

### `FilterFacet` (a user-facing filter control)

| Field     | Type                     | What it does                                                                 |
| --------- | ------------------------ | ---------------------------------------------------------------------------- |
| `field`   | `string`                 | The row field this facet filters on.                                         |
| `label`   | `string`                 | Shown on the control (dropdown placeholder / chip group label).              |
| `control` | `"select" \| "chips"`    | Presentation only — a dropdown or a set of removable chips.                  |
| `options` | `{value;label}[]` (opt.) | The choices. **Omit** to derive the distinct values from the data at render. |

A chosen facet value becomes an `is` `Rule` on `field`, run through the **same** `evaluateRules` engine as `filter` (no new matching engine), ANDed with the builder filter and any other active facets.

**Server-side seam (CollectionFrame props, not config):** pass `serverSide={true}` + `onQueryChange={({query, facetValues}) => …}` and the frame stops filtering in memory — it emits the (debounced) query + facets and renders whatever `data` you hand it, so the app can refetch (`?q=` / FTS5) later. `searchable`/`filter` defaults are unchanged, so existing consumers are unaffected.

**Primitives:** the search box is the **`SearchInput`** primitive (Input + lucide Search + a clear ✕, debounced via `debounceMs`); the facet row is the **`FilterBar`** primitive (Select or chips + "Clear all", keyboard-operable, polite live count). `List`/`CardGrid` get all of this by rendering inside `CollectionFrame` (the gallery shows the pattern).

---

## Actions: `ActionConfig` (Button, Action Row, item taps)

| Field              | Type                                                      | What it does                                                                                                |
| ------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `action`           | `"detail" \| "none" \| "navigate" \| "workflow" \| "api"` | What a tap does. **Default `"detail"`** = open the detail screen (Glide-style); `"none"` = non-interactive. |
| `target`           | `string`                                                  | The route / workflow id / endpoint, depending on `action`.                                                  |
| `confirm`          | `boolean`                                                 | `true` → ask the user to confirm before firing.                                                             |
| `disabled`         | `boolean`                                                 | Force a disabled (greyed, non-interactive) state — e.g. the user lacks access.                              |
| `showWhenDisabled` | `boolean`                                                 | When disabled: `true` shows it greyed-out, `false` hides it entirely.                                       |

---

## Layout: `ContainerConfig` (Container)

Owns the **background surface** and the **stacking** of whatever it wraps.

| Field             | Type                                               | What it does                                                                                                                                           |
| ----------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `background`      | `"none" \| "card" \| "dark" \| "light" \| "image"` | The surface: `none` transparent · `card` frosted glass · `dark`/`light` absolute dark/light panels · `image` a cover photo (with a readability scrim). |
| `backgroundImage` | `string`                                           | Image URL when `background` is `"image"`.                                                                                                              |
| `direction`       | `"vertical" \| "horizontal"`                       | `vertical` stacks children; `horizontal` lays them in columns (side by side).                                                                          |
| `columns`         | `number` (1–6)                                     | Number of columns when `direction` is `"horizontal"`.                                                                                                  |
| `padding`         | `"none" \| "sm" \| "md" \| "lg"`                   | Inner padding.                                                                                                                                         |
| `gap`             | `"none" \| "sm" \| "md" \| "lg"`                   | Space between children.                                                                                                                                |

---

## Text: `TextDisplayConfig` (Clamp)

How any displayed text handles being too long. Never grows width left-to-right.

| Field        | Type                      | What it does                                                                                                                 |
| ------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `overflow`   | `"truncate" \| "expand"`  | `truncate` clips it; `expand` shows the whole thing (wraps downward).                                                        |
| `truncateBy` | `"lines" \| "characters"` | `lines` clamps to N lines (**responsive** — adapts per screen, the recommended default); `characters` cuts at a fixed count. |
| `lines`      | `number` (1–6)            | Lines kept when `truncateBy` is `"lines"`.                                                                                   |
| `maxChars`   | `number`                  | Characters kept when `truncateBy` is `"characters"`.                                                                         |

---

## Media

### `ImageConfig` (Image)

| Field         | Type                                 | What it does                                                 |
| ------------- | ------------------------------------ | ------------------------------------------------------------ |
| `shape`       | `"square" \| "rounded" \| "circle"`  | Corner shape (circle forces a 1:1 box).                      |
| `fit`         | `"cover" \| "contain"`               | `cover` fills & crops; `contain` fits the whole image.       |
| `aspect`      | `"auto" \| "16:9" \| "4:3" \| "1:1"` | `auto` keeps the image's native ratio; others force a frame. |
| `fullBleed`   | `boolean`                            | `true` removes the rounding/border (edge-to-edge).           |
| `openOnClick` | `boolean`                            | `true` lets a tap open the image full-screen.                |
| `altText`     | `string`                             | Accessibility / alt text.                                    |

### `VideoConfig` (Video)

| Field           | Type                                 | What it does                                                             |
| --------------- | ------------------------------------ | ------------------------------------------------------------------------ |
| `controls`      | `boolean`                            | Show the player controls.                                                |
| `muted`         | `boolean`                            | Start muted (required by browsers for autoplay).                         |
| `autoplay`      | `boolean`                            | Start playing on load.                                                   |
| `loop`          | `boolean`                            | Loop the video.                                                          |
| `loopCount`     | `number \| null`                     | With `loop`: `null` = forever, `N` = play N times then stop.             |
| `allowDownload` | `boolean`                            | `false` hides the browser's download button and blocks right-click save. |
| `fullBleed`     | `boolean`                            | Edge-to-edge (no rounding/border).                                       |
| `fit`           | `"contain" \| "cover"`               | `contain` scales to the video's natural size; `cover` fills the frame.   |
| `aspect`        | `"auto" \| "16:9" \| "4:3" \| "1:1"` | `auto` keeps the video's native ratio.                                   |

### `MapConfig` (Map)

| Field          | Type                      | What it does                                                     |
| -------------- | ------------------------- | ---------------------------------------------------------------- |
| `addressField` | `string`                  | Record field holding each pin's location (a `"lat,lng"` string). |
| `captionField` | `string`                  | Record field used as a pin's popup label.                        |
| `visualType`   | `"street" \| "satellite"` | Street tiles (OpenStreetMap) or satellite imagery (Esri).        |
| `zoom`         | `number` (1–18)           | Starting zoom (1 = world, 18 = street).                          |
| `cluster`      | `boolean`                 | Group nearby pins (roadmap — needs the clustering plugin).       |
| `itemAction`   | `ActionKind`              | What tapping a pin does (default `"detail"`).                    |

---

## Per-component settings

### `ChoiceConfig` (Choice)

| Field                                             | Type                               | What it does                                                                                        |
| ------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `mode`                                            | `"single" \| "multi"`              | Pick one value, or many.                                                                            |
| `display`                                         | `"dropdown" \| "chips" \| "pills"` | `dropdown` = trigger + searchable list · `chips` = removable tags + add · `pills` = inline toggles. |
| `searchable`                                      | `boolean`                          | Show a search box inside the dropdown list.                                                         |
| `clearable`                                       | `boolean`                          | Allow clearing the whole selection.                                                                 |
| `max`                                             | `number \| null`                   | Max selections in multi mode (`null` = unlimited).                                                  |
| `placeholder` / `searchPlaceholder` / `emptyText` | `string`                           | Empty-state, search-box, and no-matches text.                                                       |

### `DataTableConfig` (Data Table)

**Extends `CollectionConfig`** — it renders through `CollectionFrame`, so it inherits the whole collection engine: `searchable`/`searchPlaceholder`, builder `filter`, `userFilter`/`filterFacets`, `sortBy`/`sortDir`, `limit`/`itemsPerPage`, `showCount`, `emptyText`. On top it adds the table-specific knobs below. (Its own interactive column-sort — click a header — is threaded into that engine, so sort still happens before pagination.)

| Field        | Type                         | What it does                                                                                    |
| ------------ | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `columns`    | `DataTableColumn[]`          | The columns: each has `key`, `header`, `type` (`text`/`number`/`badge`/…), `sortable`, `align`. |
| `striped`    | `boolean`                    | Zebra-striped rows.                                                                             |
| `density`    | `"comfortable" \| "compact"` | Row height.                                                                                     |
| `rowActions` | `boolean`                    | Show a trailing ⋯ actions column (supply `actions`).                                            |
| `surface`    | `"card" \| "none"`           | `card` = rounded bordered surface (default); `none` = flat, no border/background.               |

Pass `onRowClick?: (row) => void` (a prop, not config) to make each row an activatable, keyboard-accessible control (click / Enter / Space) for "tap row → detail". The trailing ⋯ menu stops propagation, so it never also fires the row-open. Mirrors the List collection's `onItemClick`.

### `ChartConfig` (Chart)

| Field                                                                 | Type                                                        | What it does                                                                         |
| --------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `type`                                                                | `"bar" \| "line" \| "area" \| "pie" \| "radar" \| "radial"` | The chart style.                                                                     |
| `xKey`                                                                | `string`                                                    | Category / x-axis field (slice-name for pie/radial).                                 |
| `series`                                                              | `ChartSeries[]`                                             | One or more data series (each `key`, `label`, `color`); more than one = comparative. |
| `stacked`                                                             | `boolean`                                                   | Stack bars/areas instead of grouping.                                                |
| `showLegend` / `showGrid` / `showTooltip` / `showXAxis` / `showYAxis` | `boolean`                                                   | Toggle each chart chrome element.                                                    |
| `showDataLabels`                                                      | `boolean`                                                   | Print each value on the chart.                                                       |
| `curved`                                                              | `boolean`                                                   | Smooth (monotone) lines/areas vs straight segments.                                  |
| `showDots`                                                            | `boolean`                                                   | Show point dots on line/area series.                                                 |
| `fillOpacity`                                                         | `number` (0–1)                                              | Fill opacity for bars & areas.                                                       |
| `innerRadius`                                                         | `number` (px)                                               | Donut hole for pie/radial (0 = solid).                                               |
| `animate`                                                             | `boolean`                                                   | Play the entrance animation.                                                         |
| `height`                                                              | `number` (px)                                               | Chart height.                                                                        |

### `KanbanConfig` (Kanban)

| Field                                         | Type                | What it does                                                           |
| --------------------------------------------- | ------------------- | ---------------------------------------------------------------------- |
| `groupBy`                                     | `string`            | Record field whose value sorts a card into a column (e.g. `"status"`). |
| `columns`                                     | `KanbanColumnDef[]` | The columns in order (each `value` + `label`).                         |
| `titleField` / `subtitleField` / `badgeField` | `string`            | Record fields for the card's title, subtitle, and badge (`""` = none). |
| `showCount`                                   | `boolean`           | Count badge next to each column heading.                               |
| `emptyColumnText`                             | `string`            | Placeholder in an empty column.                                        |

### `CalendarViewConfig` (Calendar)

| Field          | Type                   | What it does                                               |
| -------------- | ---------------------- | ---------------------------------------------------------- |
| `dateField`    | `string`               | Field holding an ISO date (`"2024-06-11"`).                |
| `titleField`   | `string`               | Field used as the event label.                             |
| `accentField`  | `string`               | Field whose value colour-codes the event (`""` = neutral). |
| `weekStartsOn` | `"sunday" \| "monday"` | First day of the week.                                     |
| `maxPerDay`    | `number`               | Events shown per day before collapsing to "+N more".       |

### `DetailViewConfig` (Fields)

| Field     | Type            | What it does                                        |
| --------- | --------------- | --------------------------------------------------- |
| `fields`  | `DetailField[]` | The label+value rows (each `key`, `label`, `type`). |
| `columns` | `1 \| 2`        | `1` = stacked, `2` = two-column grid.               |

### `StatGridConfig` (Big Numbers)

| Field       | Type          | What it does                                |
| ----------- | ------------- | ------------------------------------------- |
| `columns`   | `2 \| 3 \| 4` | Cards per row at the widest breakpoint.     |
| `showDelta` | `boolean`     | Show the delta/trend line under each value. |

### `ChecklistConfig` (Checklist)

| Field             | Type      | What it does                             |
| ----------------- | --------- | ---------------------------------------- |
| `showProgress`    | `boolean` | Show a progress bar with done/total.     |
| `strikeCompleted` | `boolean` | Strike through and mute completed items. |

### `FormConfig` (Form)

| Field         | Type          | What it does                                                          |
| ------------- | ------------- | --------------------------------------------------------------------- |
| `fields`      | `FormField[]` | The fields (each `name`, `label`, `type`, `placeholder`, `required`). |
| `submitLabel` | `string`      | The submit button text.                                               |
| `columns`     | `1 \| 2`      | One- or two-column layout.                                            |

### `PermissionMatrixConfig` (Permission Matrix)

A role's access-rights grid: rows are the app's modules (passed in), columns are the four fixed rights **Read · Create · Edit · Delete**, cells are on/off toggles. The value is a `Record<moduleKey, { read, create, edit, delete }>`; a module missing from the value renders all-off.

| Field          | Type                               | What it does                                                                                                           |
| -------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `modules`      | `{ key: string; label: string }[]` | The rows. `key` is the app's module id, `label` is shown. Adding/removing a module is a config-only change.            |
| `mode`         | `"edit" \| "read" \| "locked"`     | `edit` = toggleable; `read` = view-only (disabled); `locked` = view-only AND every cell forced ON (the Admin role).    |
| `autoFlipRead` | `boolean`                          | When `true`, turning ON Create/Edit/Delete forces Read ON and locks it (you can't have write without read).            |
| `surface`      | `"card" \| "none"`                 | `card` = rounded bordered surface (default); `none` = flat (the sticky module column then fills with `bg-background`). |

### Record-detail building blocks

For composing a record-detail screen entirely from the library. All three are **flat by default** (`surface: "none"`), config-driven, and wrap long text instead of scrolling sideways.

**`DescriptionListConfig` (Description List)** — a `{ label, value }[]` metadata block for an Overview panel.

| Field       | Type               | What it does                                                        |
| ----------- | ------------------ | ------------------------------------------------------------------- |
| `columns`   | `1 \| 2`           | `1` = stacked, `2` = two-column grid.                               |
| `hideEmpty` | `boolean`          | Drop rows whose `value` is empty (`""`/`null`/`undefined`/`false`). |
| `surface`   | `"card" \| "none"` | `none` = flat (default); `card` = bordered surface.                 |

**`ActivityFeedConfig` (Activity Feed)** — a `{ id, description, actor?, timestamp? }[]` timeline.

| Field         | Type               | What it does                                                 |
| ------------- | ------------------ | ------------------------------------------------------------ |
| `newestFirst` | `boolean`          | Sort newest-first by `timestamp` (descending; ISO/sortable). |
| `surface`     | `"card" \| "none"` | `none` = flat (default); `card` = bordered surface.          |
| `emptyText`   | `string`           | Shown when there's no activity.                              |

**`RecordDetailConfig` (Record Detail)** — the scaffold: a header (`title`, `subtitle`, `avatarSrc`/`avatarFallback`, `actions` slot — all props) above its `children` (typically a `TabsView` composing the two blocks above).

| Field     | Type               | What it does                                        |
| --------- | ------------------ | --------------------------------------------------- |
| `surface` | `"card" \| "none"` | `none` = flat (default); `card` = bordered surface. |

### `TabsConfig` (Tabs — config-driven, Glide-style)

Tabs can be driven by data via `<TabsView config={…} />`: the tabs are an array, each with a label, a lucide icon name, and an optional badge (a count or a short tag). Add/remove/reorder a tab = a config change, no code change. (The compositional `<Tabs><TabsList><TabsTrigger>` API still exists for hand-built tabs.)

| Field       | Type               | What it does                                                                                          |
| ----------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `tabs`      | `TabItem[]`        | The tabs as data — each `{ value, label, icon, badge, badgeVariant }` (see below).                    |
| `variant`   | `"pill" \| "line"` | `pill` = a frosted segmented control (Glide's "Button"); `line` = an underline rail (Glide's "Line"). |
| `fullWidth` | `boolean`          | Stretch the bar so the tabs share the full width equally.                                             |

`TabItem`: `value` (id) · `label` (shown) · `icon` (lucide name, kebab-case e.g. `"inbox"`; `""` = none) · `badge` (a count or tag e.g. `"24"`/`"New"`; `""` = none) · `badgeVariant` (`""` = neutral count chip, else a Badge variant like `"destructive"` to colour-code). A bar that overflows its container scrolls horizontally rather than spilling out.

---

## The screen engine: `ScreenRecipe` + `ScreenRenderer`

The config-driven runtime that renders a serializable **recipe** into a real
screen by composing the existing collections. The LIBRARY owns the contract
(`lib/recipe.ts`); the consuming app imports it. The engine renders recipes and
speaks the URL grammar — it does **not** fetch data, call APIs, store recipes,
or own the router (those are the host's job).

### `ScreenRecipe` (a screen, as data)

| Field          | Type                                                             | What it does                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`         | `"list" \| "detail" \| "edit" \| "add" \| "confirm" \| "custom"` | Which library composition to render.                                                                                                                                      |
| `presentation` | `"responsive" \| "overlay" \| "sheet" \| "fullscreen"`           | Default `"responsive"` = centered overlay on desktop / bottom sheet on mobile. The others force one mode. `edit`/`add`/`confirm` always render as a **layer** on top.     |
| `binding`      | `{ module; source? }`                                            | The module the screen reads/writes.                                                                                                                                       |
| `fields`       | `RecipeField[]`                                                  | Columns (list), inputs (edit/add), or rows (detail). Each wraps a `FieldConfig` + the bound `column` + a type (`text`/`number`/`choice`/`image`/`date`/`switch`/`notes`). |
| `actions`      | `RecipeAction[]`                                                 | `{ id, label, action, variant?, confirm?, before?, after?, gate? }` — `action` is the named action the host dispatches.                                                   |
| `gate`         | `ScreenGate`                                                     | Screen-level access gate (see below).                                                                                                                                     |
| `header`       | `{ title; subtitle?; avatar? }`                                  | detail: which record columns feed the header.                                                                                                                             |
| `tabs`         | `RecipeTab[]`                                                    | detail: named tabs, each a block (`description` / `fields` / `activity` / `list`).                                                                                        |
| `display`      | `"table" \| "list" \| "cards"`                                   | list: how rows render (default `table`).                                                                                                                                  |
| `collection`   | `CollectionConfig`                                               | list: the search/filter/sort/pagination config.                                                                                                                           |
| `layout`       | `RecipeNode`                                                     | custom: a tree of `stack`/`row` containers + block leaves (`row` stacks on mobile).                                                                                       |
| `confirm`      | `{ title; body; variant? }`                                      | confirm: the prompt.                                                                                                                                                      |

### Gating — `ScreenGate { module; right; showWhenDenied? }`

`right` is `"read"|"create"|"edit"|"delete"`. The engine reads the injected
per-module `rights` and **hides** a gated screen/field/action by default;
`showWhenDenied: "disabled"` renders it greyed instead. The app does NOT wire any
of this per-button — it's automatic from the rights. **This is convenience only:
the host MUST re-check on the server for every fetch + action.**

### `ScreenRenderer` props

`recipe` · `data` (`{ record?, rows?, options?, sets? }`, host-injected) ·
`rights` (`Record<module, {read,create,edit,delete}>`) · `onAction(actionId, ctx)`
· `presentation?` (override) · `onIntent(intent)` where intent is
`{kind:"open",module,id}` / `{kind:"tab",tab}` / `{kind:"close"}` (the host maps
these to URL changes). Forms (edit/add) submit through `onAction` with the values.

### Deep-link URL grammar (`lib/recipe.ts` helpers)

- **PATH = the record spine:** `/<module>/<id>/<childModule>/<childId>/…` (host prefixes a tenant segment). `parseScreenPath(segments)` ↔ `buildScreenPath(levels)`.
- **QUERY = the transient layer:** `?panel=edit|add(&module=…)` · `?confirm=<action>&id=<id>` · `?tab=<key>`. `parseScreenQuery(searchParams)` ↔ `buildScreenQuery(state)`.
- **Breadcrumbs:** `screenCrumbs(levels, labelFor, prefix?)` builds the trail; the **`Breadcrumbs`** primitive (`items`, `collapseAfter`, `onNavigate`) collapses the middle to a dropdown on small screens (first · … · last-two) so it never scrolls sideways.

---

## Agent & app components (props)

These are data-driven surfaces (like `Chat`/`Comments`): they take typed props +
callbacks rather than a `config` object. All are flat, token-driven, dark-mode,
and keep their scrolling INSIDE their own box (never the page).

### `AgentChat` (agent conversation)

| Prop         | Type              | What it does                                                                                                                                                         |
| ------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`      | `AgentChatItem[]` | Rows: `{ id, role:"user"\|"assistant"\|"tool", content }`; tool rows add `actionLabel`, `status:"pending"\|"done"\|"failed"`, `summary`, optional `onView`/`onUndo`. |
| `streaming`  | `boolean`         | Show a typing indicator on the last assistant row.                                                                                                                   |
| `disabled`   | `boolean`         | Disable the composer.                                                                                                                                                |
| `emptyState` | `ReactNode`       | Shown when there are no rows.                                                                                                                                        |
| `onSend`     | `(text) => void`  | Fired from the composer (Enter or Send; Shift+Enter = newline).                                                                                                      |

### `CopilotOverlay` (the "it's driving the screen" affordance)

| Prop            | Type                           | What it does                                                                        |
| --------------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| `active`        | `boolean`                      | Render the overlay (renders nothing when false).                                    |
| `steps`         | `{ label; status? }[]`         | The plan; the current step's `label` is shown.                                      |
| `currentIndex`  | `number`                       | Drives "step N of M".                                                               |
| `onStop`        | `() => void`                   | The only interactive control besides the bar — the rest of the screen stays usable. |
| `position`      | `"top" \| "bottom"`            | Where the bar floats (default `bottom`).                                            |
| `highlightRect` | `{ top; left; width; height }` | The host positions a ring over the element being acted on. Respects reduced-motion. |

### `RunSteps` (multi-step job) & `DataPreviewTable` (preview before write)

- **`RunSteps`** — `steps: { label, status:"pending"\|"running"\|"done"\|"failed", detail? }[]`, optional `onStop` (shown while a step is running).
- **`DataPreviewTable`** — `columns: string[]`, `rows: ReactNode[][]`, `totalCount: number`, optional `issues: (string\|null)[]` (per-row marker with the message in a tooltip).

### `ImportWizard` (3-stage import)

`targetSchema: { fields: { key, label, required }[] }` · `suggestedMapping: Record<sourceCol, targetKey>` (pre-fills stage 2; its keys are the source columns) · `previewRows: ReactNode[][]` · `stageStatus: { valid, message? }` (stage-1 file feedback) · `onFile(file)` · `onMappingChange(map)` · `onConfirm()`. Stages: Validate file → Map columns → Preview & import (renders `DataPreviewTable`).

### Learning: `ArticleBody`, `ProgressToggle`, `ProgressDashboard`

- **`ArticleBody`** — `title?`, `contentType?` (a chip), `body?` (safe markdown subset: `#`/`##` headings, `-` lists, `**bold**`, `[links](url)`), `externalUrl?`. **Every href it sets (inline links + `externalUrl`) is scheme-guarded:** only `http`/`https`/`mailto` survive — a dangerous scheme (`javascript:`, `data:`, `vbscript:`, …) collapses an inline link to an inert `#` and drops the external button entirely. The guard is the shared, unit-tested **`safeHref` in `lib/url.ts`**, used library-wide (also by `TicketThread`, `Breadcrumbs`, and `WebEmbed`).
- **`ProgressToggle`** — `done: boolean`, `onToggle()` — a reversible "Mark as done" ⇄ "Done".
- **`ProgressDashboard`** — `members: {id,name}[]`, `items: {id,label}[]`, `done: {memberId,itemId}[]` — a completion grid with per-member + per-item rollups (the math is the unit-tested `completionStats` in `lib/progress.ts`).

### `TicketThread` (support conversation)

`ticket: { description, type, status:"open"\|"in-progress"\|"resolved"\|"reopened", fromScreen?:{label,href?}, attachments? }` · `replies: { id, author, time, body, attachments?, aiDrafted? }[]` (an `aiDrafted` reply is labelled "Drafted by the assistant") · `members: {id,name}[]` (for @mention autocomplete) · `canResolve: boolean` (gates the Resolved status) · `showStatusControl?: boolean` (default `true`; set `false` to hide the in-thread status dropdown when the host drives status with its own control above the thread — the status Badge still shows the current status) · `onReply(body, attachments, mentions)` · `onStatusChange(status)` · `onMention(member)`. The My/All ticket tabs reuse the existing `Tabs` + `List`.

### `StatusStepper` (lifecycle status control)

A **primitive**: a left-to-right lifecycle stepper (e.g. Open → In progress → Resolved). Stages up to and including `value` read as "reached" (filled with their tone), the current one is ringed ("you are here"), and later stages are muted. With `onChange` set (and not `disabled`), clicking a stage changes the status. It scrolls inside itself on narrow screens rather than widening the page, and is keyboard-operable. This is the library version of the host-app control the Ticket Thread demo pairs with `showStatusControl={false}`.

| Prop       | Type                                 | What it does                                                                                                                                                   |
| ---------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stages`   | `{ value; label }[]`                 | The lifecycle stages, in order, left to right.                                                                                                                 |
| `value`    | `string`                             | The current stage's `value`.                                                                                                                                   |
| `tones`    | `Record<string, StepperTone>` (opt.) | A colour tone per stage value — `"neutral" \| "info" \| "warning" \| "success" \| "danger"` (defaults to `"neutral"`). Maps to the same tokens the Badge uses. |
| `onChange` | `(value) => void` (opt.)             | Fired with a stage's `value` when it's clicked. Omit for a read-only stepper.                                                                                  |
| `disabled` | `boolean` (opt.)                     | Force a non-interactive, muted-interaction state.                                                                                                              |

---

## Simple primitives (props, not a config object)

Buttons, badges, spinners, etc. take plain props (usually `variant` and `size`)
rather than a `config`. Their options live as **CVA variants** in each component
file and are demonstrated live in the gallery (`/components`). For example:
`<Button variant="outline" size="lg">` · `<Badge variant="success">` ·
`<Spinner size="sm">`.

> Source of truth: the typed configs in `lib/config.ts` and each
> component's own file. This document mirrors them in one place; if they ever
> disagree, the code wins.
