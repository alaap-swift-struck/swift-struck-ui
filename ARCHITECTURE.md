# Architecture

This document is the contract. If a change would violate something here, the
change is wrong — not the document. Keeping to it is what stops brimba from
sprawling the way past projects did.

## What brimba is

A **web-first, cross-platform component & collection library** that you use as a
base to build entire applications. Two kinds of building blocks:

1. **Primitives** — shadcn-style atoms (Button, Input, Dialog…).
2. **Collections** — Glide-style data-bound views (List, Grid, Kanban,
   Calendar, Detail, Form…). This is where the leverage is.

Distribution is a **workspace package**: brimba is imported by your apps (one
workspace/monorepo) so a central fix propagates to every app instantly, while
each app keeps its own per-component `config`. A copy-in registry may be layered
on later for external/standalone use.

## The three layers

Everything lives in exactly one layer, and dependencies flow **one direction
only**:

```
  Layer 0   tokens        app/globals.css + registry/tokens
                │           colors, radii, surfaces — the single source of truth
                ▼
  Layer 1   primitives    registry/primitives
                │           atoms built from tokens, via Radix + CVA
                ▼
  Layer 2   collections   registry/collections
                            data-bound views built from primitives
```

- Collections may use primitives. Primitives may **not** reach into collections.
- Primitives use tokens. Tokens import nothing.
- The library (`registry/`, `lib/`) never depends on `app/` (the docs harness).

This is not a guideline — it's enforced by `npm run guardrails`
([`.dependency-cruiser.cjs`](.dependency-cruiser.cjs)). A violation fails the
check.

## The five rules that prevent bloat

1. **Strict layering.** Above. Enforced, not trusted.
2. **Tokens are the only source of truth.** No hardcoded colors or sizes in any
   component — only Tailwind utilities that resolve to Layer 0. Re-theming, dark
   mode, and future native skins are then a single-file edit.
3. **Variants, not new components.** A visual variation is a
   [CVA](https://cva.style) variant on the existing component, never a new file.
   `Button` with a `variant`, not `PrimaryButton` + `GhostButton` + `IconButton`.
4. **Every component ships its docs.** A component is not "done" until it has a
   co-located `.mdx` doc with at least one live example. No exceptions — this is
   how documentation stays "super robust" without a doc-debt backlog.
5. **Reuse before adding.** Before writing a component, check whether an existing
   one plus a variant or a prop covers it. The smallest set that works wins.

## Cross-platform strategy

One web codebase, wrapped natively — no rewrite, ever.

- **Web** — Next.js + React + Tailwind v4. The primary target and dev surface.
- **Desktop (macOS/Windows/Linux)** — [Tauri](https://tauri.app) wraps the
  static web build.
- **Mobile (iOS/Android)** — [Capacitor](https://capacitorjs.com) wraps the same
  build.

`next.config.ts` is ready for `output: "export"`, which produces the static
build both wrappers consume. Native shells are Phase 5; nothing about the
component code changes when we add them.

## Directory map

```
app/                  Next.js docs + showcase harness (NOT shipped to consumers)
  globals.css         Layer 0 tokens live here (CSS-first Tailwind v4 @theme)
lib/
  utils.ts            cn() — the class-merge helper every component uses
registry/             THE library — the copy-in source
  tokens/             Layer 0 TS helpers (CSS tokens are in app/globals.css)
  primitives/         Layer 1 — one folder per atom (component + .mdx)
  collections/        Layer 2 — one folder per data view (component + .mdx)
registry.json         Manifest of every registry item (drives the copy-in CLI)
.dependency-cruiser.cjs   The enforced layering rules
ARCHITECTURE.md       This file
CONTRIBUTING.md       How to add a component without breaking the rules
```

## Configuration (the Glide-style meta-fields)

Every configurable component (especially collections like Choice, DataTable,
Kanban) is driven by a single typed `config` prop. This is what lets the
component code live centrally and update everywhere, while each app keeps its
own settings.

Two hard rules:

1. **No omittable fields.** Each component exports a `XConfig` type in which
   **every field is required** — no `?` optionals. You cannot render the
   component without spelling out (or spreading) every setting, so no knob is
   ever invisible. Adding a new field later is a deliberate, surfaced change at
   every call site.
2. **Ship a default template.** Each component also exports a fully-populated
   `defaultXConfig: XConfig`. Start from it and override what you need:

   ```tsx
   import {
     Choice,
     defaultChoiceConfig,
   } from "@/registry/primitives/choice/choice"
   ;<Choice
     options={tags}
     value={value}
     onChange={setValue}
     config={{ ...defaultChoiceConfig, mode: "multi", display: "pills" }}
   />
   ```

The component never merges partial configs — it consumes a complete one. This
keeps configs serializable (savable per app) and guarantees the type is the
single source of truth for "what can this component do."

## Component taxonomy (orthogonal to layers)

Two different axes — don't conflate them:

- **Layers** (tokens → primitives → collections) are the _dependency_ rules
  (what can import what). Internal/architectural.
- **Categories** are a _human/config_ taxonomy. A `Button` is a layer-1
  primitive **and** category **Action**; a `DataTable` is a layer-2 collection
  **and** category **Collection**. Orthogonal.

| Category   | What it is                                            | Examples                                                                                    |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Input      | collects user input                                   | input, choice, checkbox, switch, slider, date-picker, file-upload, signature, notes, rating |
| Content    | displays data, read-only                              | typography, image, video, map, stat-grid, progress, chart, detail-view, badge               |
| Action     | interacting triggers a side-effect (api/workflow/nav) | button, action-row, link                                                                    |
| Collection | data-bound view over a list/table                     | list, card-grid, data-table, kanban, calendar, checklist, comments, chat                    |
| Navigation | move between pages/views                              | tabs, breadcrumb, pagination, nav-menu                                                      |
| Overlay    | floats above content                                  | dialog, sheet, popover, dropdown, tooltip, command, toast                                   |
| Layout     | structure & space                                     | card, separator, spacer, scroll-area, accordion                                             |

## Configuration model (layered)

Config composes, it doesn't repeat (see [`lib/config.ts`](lib/config.ts)):

1. **BaseConfig** — on **every** component: `visible` + `visibilityRules`.
2. **Category mixin** — `FieldConfig` (label/required/validation),
   `ActionConfig` (what a tap triggers), `CollectionConfig` (dataSource /
   filter / sort — _declared_ here, _executed_ by the data layer), `ContentConfig`.
3. **Per-component knobs** — e.g. `ChartConfig` type/series.

So `ChoiceConfig = BaseConfig & { mode, display, … }`, built by spreading
`defaultBaseConfig` into `defaultChoiceConfig`. Every component therefore shares
the same base and self-hides via `useIsVisible(config)`.

**Visibility / filtering rules** are one shape (`Rule`): `source` (row / user /
app) + `field` + `op` + `value`, ANDed (or ORed) and evaluated against a
`VisibilityContext` provided by `<VisibilityProvider>`. The same `Rule[]` powers
collection **data filtering** — declared in config, executed at the future
D1/SQL query layer (the component just receives rows).

## Roadmap

| Phase | Goal                                                         |
| ----- | ------------------------------------------------------------ |
| 0 ✅  | Foundation & guardrails (this commit)                        |
| 1     | Tokens & theming — finalize the token set + light/dark       |
| 2     | Primitives — curate the ~15–20 shadcn atoms, each documented |
| 3     | Collections — List, Grid, Kanban, Calendar, Detail, Form     |
| 4     | Registry & CLI — make components copy-in installable         |
| 5     | Native shells — Tauri (desktop) + Capacitor (mobile)         |

We do not start a phase until the previous one is documented and
`npm run check` is green.
