# Glide parity

Every component in Glide's "Insert Component" palette, mapped to brimba.
Source: the user's screenshots of the Glide palette. Keep this honest — it's
our checklist for "are we missing anything."

Legend: ✅ built · ⏳ planned (needs a dependency or a bigger effort) · ➖
intentionally skipped (niche / out of scope for now)

## AI

| Glide       | brimba | Notes                                           |
| ----------- | ------ | ----------------------------------------------- |
| Custom (AI) | ➖     | App-specific AI block; not a base UI primitive. |

## Title (hero headers)

| Glide                            | brimba           | Notes                                                         |
| -------------------------------- | ---------------- | ------------------------------------------------------------- |
| Simple / Image / Profile / Cover | ⏳ `title-block` | A small set of hero/header blocks (one component, `variant`). |

## Collections

| Glide     | brimba           | Notes                                        |
| --------- | ---------------- | -------------------------------------------- |
| Card      | ✅ card-grid     |                                              |
| List      | ✅ list          |                                              |
| Table     | ✅ data-table    |                                              |
| Data Grid | ✅ data-table    | Same component; spreadsheet-grid mode later. |
| Checklist | ✅ checklist     |                                              |
| Calendar  | ✅ calendar-view |                                              |
| Kanban    | ✅ kanban        |                                              |
| Comments  | ⏳ comments      | Threaded comments collection.                |
| Chat      | ⏳ chat          | Message thread UI.                           |
| Custom    | ➖               | App-specific.                                |

## Layout

| Glide          | brimba       | Notes                          |
| -------------- | ------------ | ------------------------------ |
| Container      | ✅ card      | Card is our container surface. |
| Separator      | ✅ separator |                                |
| Tabs Container | ✅ tabs      |                                |
| Spacer         | ✅ spacer    |                                |

## Text

| Glide                                      | brimba        | Notes                                              |
| ------------------------------------------ | ------------- | -------------------------------------------------- |
| Text / Headline / Notes / Rich Text / Hint | ✅ typography | Headline + Text + Hint now; Rich Text (editor) ⏳. |

## Content

| Glide                       | brimba         | Notes                               |
| --------------------------- | -------------- | ----------------------------------- |
| Fields                      | ✅ detail-view |                                     |
| Big Numbers                 | ✅ stat-grid   |                                     |
| Progress                    | ✅ progress    |                                     |
| Image                       | ⏳ image       | With AspectRatio (have) + fallback. |
| Video                       | ⏳ video       |                                     |
| Location / Map              | ⏳ map         | Needs a maps dependency.            |
| Audio / Audio Recorder      | ➖             | Niche; revisit on demand.           |
| Bar / Line / Radial / Chart | ⏳ chart       | One Recharts-backed batch.          |

## Actions

| Glide               | brimba              | Notes                                      |
| ------------------- | ------------------- | ------------------------------------------ |
| Button              | ✅ button           |                                            |
| Button Block        | ✅ via button group | Compose buttons; a helper later if needed. |
| Link                | ✅ button `asChild` |                                            |
| Action Row          | ✅ action-row       |                                            |
| Rating              | ✅ rating           |                                            |
| Contact             | ⏳                  | Composition of action-row + avatar.        |
| Voice Transcription | ➖                  | App-specific AI.                           |

## Forms

| Glide                         | brimba  | Notes                               |
| ----------------------------- | ------- | ----------------------------------- |
| Form Container / Contact Form | ⏳ form | react-hook-form batch (validation). |

## Form elements

| Glide                               | brimba         | Notes                        |
| ----------------------------------- | -------------- | ---------------------------- |
| Text / Email / Phone / Number Entry | ✅ input       | Typed variants of one Input. |
| Switch                              | ✅ switch      |                              |
| Choice                              | ✅ choice      |                              |
| Checkbox                            | ✅ checkbox    |                              |
| Date / Date Time                    | ⏳ date-picker | Calendar-input batch.        |
| Image Picker / File Picker          | ⏳ file-upload | Upload batch.                |

## Advanced

| Glide       | brimba        | Notes                            |
| ----------- | ------------- | -------------------------------- |
| Breadcrumbs | ✅ breadcrumb |                                  |
| Tabs        | ✅ tabs       |                                  |
| Web Embed   | ✅ web-embed  |                                  |
| Spinner     | ✅ spinner    |                                  |
| Signature   | ⏳ signature  | Canvas capture.                  |
| Stopwatch   | ⏳ stopwatch  |                                  |
| Scanner     | ➖            | Hardware/business; out of scope. |

## Custom

| Glide           | brimba | Notes                                             |
| --------------- | ------ | ------------------------------------------------- |
| Dynamic Content | ➖     | A conditional-render pattern, not a UI component. |

---

**Summary:** the core primitives + the marquee collections are covered. This
batch closes Checklist, Stat-grid, Action-row, Rating, Spinner, Web-embed,
Spacer, and Typography. The remaining ⏳ items cluster into a few dependency-
gated batches: **charts** (Recharts), **forms** (react-hook-form),
**date/file inputs**, **media** (image/video/map), and **comments/chat**.
