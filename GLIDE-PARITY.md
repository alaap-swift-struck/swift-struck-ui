# Glide parity

Every component in Glide's "Insert Component" palette, mapped to Swift Struck UI.
Source: the user's screenshots of the Glide palette. Keep this honest — it's
our checklist for "are we missing anything."

Legend: ✅ built · ⏳ planned (needs a dependency or a bigger effort) · ➖
intentionally skipped (niche / out of scope for now)

## AI

| Glide       | Swift Struck UI | Notes                                           |
| ----------- | --------------- | ----------------------------------------------- |
| Custom (AI) | ➖              | App-specific AI block; not a base UI primitive. |

## Title (hero headers)

| Glide                            | Swift Struck UI | Notes                                                         |
| -------------------------------- | --------------- | ------------------------------------------------------------- |
| Simple / Image / Profile / Cover | ✅ title        | A small set of hero/header blocks (one component, `variant`). |

## Collections

Every collection that renders through `CollectionFrame` shares one engine
(`selectRows`): builder **filter**, user-facing **search** (`searchable` +
debounced `SearchInput`) and **filter facets** (`userFilter` + `filterFacets`,
dropdown / searchable combobox / chips / numeric range via `FilterBar`),
**sort**, **limit**, and **pagination** —
plus a `serverSide` + `onQueryChange` seam for server `?q=` / FTS5 later. See
CONFIG-REFERENCE.md.

| Glide      | Swift Struck UI      | Notes                                                                                                   |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------- |
| search     | ✅ searchable        | Debounced `SearchInput`, clear button, over the named keys.                                             |
| userFilter | ✅ userFilter        | `filterFacets` → `FilterBar` (select / searchable combobox / chips / range), ANDed via the rule engine. |
| Card       | ✅ card-grid         |                                                                                                         |
| List       | ✅ list              |                                                                                                         |
| Table      | ✅ data-table        | Renders through CollectionFrame — inherits search/filter/sort/limit/pages.                              |
| Data Grid  | ✅ data-table        | Same component; spreadsheet-grid mode later.                                                            |
| Checklist  | ✅ checklist         |                                                                                                         |
| Calendar   | ✅ calendar-view     |                                                                                                         |
| Kanban     | ✅ kanban            |                                                                                                         |
| Comments   | ✅ comments          | Threaded comments collection.                                                                           |
| Chat       | ✅ chat              | Message thread UI.                                                                                      |
| —          | ✅ permission-matrix | Beyond Glide: role access-rights grid (modules × Read/Create/Edit/Delete).                              |
| Custom     | ➖                   | App-specific.                                                                                           |

## Layout

| Glide          | Swift Struck UI | Notes                          |
| -------------- | --------------- | ------------------------------ |
| Container      | ✅ card         | Card is our container surface. |
| Separator      | ✅ separator    |                                |
| Tabs Container | ✅ tabs         |                                |
| Spacer         | ✅ spacer       |                                |

## Text

| Glide                                      | Swift Struck UI       | Notes                                                                                               |
| ------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------- |
| Text / Headline / Notes / Rich Text / Hint | ✅ typography + notes | Headline / Text / Hint, plus a notes editor (bold/italic/highlight/bullet/numbered list/separator). |

## Content

| Glide                       | Swift Struck UI | Notes                                                                                |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| Fields                      | ✅ detail-view  |                                                                                      |
| Big Numbers                 | ✅ stat-grid    |                                                                                      |
| Progress                    | ✅ progress     |                                                                                      |
| Image                       | ✅ image        | With AspectRatio (have) + fallback.                                                  |
| Video                       | ✅ video        |                                                                                      |
| Location / Map              | ✅ map          | OpenStreetMap embed by lat/lng — no dependency, no API key.                          |
| Audio / Audio Recorder      | ➖              | Niche; revisit on demand.                                                            |
| Bar / Line / Radial / Chart | ✅ chart        | One config-driven Recharts component (bar/line/area/pie/radar/radial, multi-series). |

## Actions

| Glide               | Swift Struck UI     | Notes                                      |
| ------------------- | ------------------- | ------------------------------------------ |
| Button              | ✅ button           |                                            |
| Button Block        | ✅ via button group | Compose buttons; a helper later if needed. |
| Link                | ✅ button `asChild` |                                            |
| Action Row          | ✅ action-row       |                                            |
| Rating              | ✅ rating           |                                            |
| Contact             | ⏳                  | Composition of action-row + avatar.        |
| Voice Transcription | ➖                  | App-specific AI.                           |

## Forms

| Glide                         | Swift Struck UI | Notes                                            |
| ----------------------------- | --------------- | ------------------------------------------------ |
| Form Container / Contact Form | ✅ form         | Config-driven, native required/email validation. |

## Form elements

| Glide                               | Swift Struck UI | Notes                        |
| ----------------------------------- | --------------- | ---------------------------- |
| Text / Email / Phone / Number Entry | ✅ input        | Typed variants of one Input. |
| Switch                              | ✅ switch       |                              |
| Choice                              | ✅ choice       |                              |
| Checkbox                            | ✅ checkbox     |                              |
| Date / Date Time                    | ✅ date-picker  | Calendar-input batch.        |
| Image Picker / File Picker          | ✅ file-upload  | Upload batch.                |

## Advanced

| Glide       | Swift Struck UI | Notes                            |
| ----------- | --------------- | -------------------------------- |
| Breadcrumbs | ✅ breadcrumb   |                                  |
| Tabs        | ✅ tabs         |                                  |
| Web Embed   | ✅ web-embed    |                                  |
| Spinner     | ✅ spinner      |                                  |
| Signature   | ✅ signature    | Canvas capture.                  |
| Stopwatch   | ✅ stopwatch    |                                  |
| Scanner     | ➖              | Hardware/business; out of scope. |

## Custom

| Glide           | Swift Struck UI | Notes                                             |
| --------------- | --------------- | ------------------------------------------------- |
| Dynamic Content | ➖              | A conditional-render pattern, not a UI component. |

## Beyond Glide (no Glide equivalent)

These ship on top of palette parity — they have no Glide counterpart.

| Swift Struck UI                                                                               | What it is                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| permission-matrix                                                                             | Role access-rights grid (modules × Read/Create/Edit/Delete).                                                                                                                     |
| status-stepper                                                                                | Left-to-right lifecycle stepper (open → in progress → resolved), clickable to change status.                                                                                     |
| searchable / async / range filter facets                                                      | Beyond Glide's fixed facet list: a facet can search itself (`searchable`), fetch its options as you type (`onSearch`, for thousands of values), or be a numeric min/max `range`. |
| agent-chat · copilot-overlay · run-steps · data-preview-table · import-wizard · ticket-thread | Agent/app surfaces — an assistant conversation, the "it's driving the screen" overlay, bulk-job steps, a write-preview, a 3-stage import, and a support thread.                  |
| article-body · progress-toggle · progress-dashboard                                           | Learning surfaces — in-app article (safe markdown), a done toggle, and a members × items completion grid.                                                                        |
| screen-renderer (`lib/recipe.ts`)                                                             | A config-driven screen engine that composes recipes into full screens with permission gating + deep links.                                                                       |

---

**Summary:** Glide-palette parity is essentially complete — every component is
built except **Contact** (a trivial composition of action-row + avatar, ⏳) and
the intentionally-skipped (➖) niche items (AI Custom, Audio/Recorder, Scanner,
Voice Transcription, Dynamic Content). On top of parity, the library adds the
**Beyond Glide** surfaces above. Everything is token-backed, config-driven where
it matters, live-editable in the gallery playground, and covered by the CI test
suite.
