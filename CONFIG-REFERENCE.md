# Config reference — every component, every setting

This is the organized, field-by-field reference for **how each component is
configured and what each setting does**. It's the human + AI map of the library:
read this (plus the typed configs in `packages/ui/lib/config.ts`, which carry the
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
→ search → sort → paginate`.

| Field          | Type              | What it does                                                                           |
| -------------- | ----------------- | -------------------------------------------------------------------------------------- |
| `dataSource`   | `string`          | Name of the table/relation feeding the collection (used by the data layer).            |
| `title`        | `string`          | Header above the collection. `""` = no header.                                         |
| `filter`       | `Rule[]`          | Rows are kept only if they pass these rules (per-row).                                 |
| `sortBy`       | `string`          | Field to sort by. `""` = original order.                                               |
| `sortDir`      | `"asc" \| "desc"` | Sort direction.                                                                        |
| `limit`        | `number \| null`  | Cap on the **total** rows ever shown. `null` = no cap.                                 |
| `itemsPerPage` | `number \| null`  | Rows per page (adds a Prev/Next pager). `null` = show everything, no pagination.       |
| `scrollToTop`  | `boolean`         | On page change, `true` scrolls the collection's top back into view; `false` stays put. |
| `searchable`   | `boolean`         | Show a search box that filters on the named keys.                                      |
| `showCount`    | `boolean`         | Show the live "Showing X of Y" count (updates with search/filter).                     |
| `emptyText`    | `string`          | Message shown when no rows match.                                                      |

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

| Field                             | Type                         | What it does                                                                                    |
| --------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `columns`                         | `DataTableColumn[]`          | The columns: each has `key`, `header`, `type` (`text`/`number`/`badge`/…), `sortable`, `align`. |
| `searchable`                      | `boolean`                    | Global search box over all columns.                                                             |
| `striped`                         | `boolean`                    | Zebra-striped rows.                                                                             |
| `density`                         | `"comfortable" \| "compact"` | Row height.                                                                                     |
| `rowActions`                      | `boolean`                    | Show a trailing ⋯ actions column (supply `actions`).                                            |
| `searchPlaceholder` / `emptyText` | `string`                     | Search-box and no-rows text.                                                                    |

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

---

## Simple primitives (props, not a config object)

Buttons, badges, spinners, etc. take plain props (usually `variant` and `size`)
rather than a `config`. Their options live as **CVA variants** in each component
file and are demonstrated live in the gallery (`/components`). For example:
`<Button variant="outline" size="lg">` · `<Badge variant="success">` ·
`<Spinner size="sm">`.

> Source of truth: the typed configs in `packages/ui/lib/config.ts` and each
> component's own file. This document mirrors them in one place; if they ever
> disagree, the code wins.
