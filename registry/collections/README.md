# Layer 2 — Collections

The high-leverage layer and the reason Swift Struck UI exists: **Glide-style,
data-bound views**. You hand a collection an array of records and a small config,
and it renders a polished, interactive surface.

Planned collections:

- **List** — rows with title/subtitle/leading/trailing slots
- **Grid / Card grid** — responsive card layouts
- **Kanban** — draggable columns
- **Calendar** — month/week/agenda
- **Detail** — a single record's full view
- **Form** — auto-generated create/edit forms from a record shape

## Rules

- **Compose from [primitives](../primitives/README.md) only** (which in turn use
  tokens). A collection should contain almost no raw markup of its own — it
  arranges primitives.
- **Data in, view out.** Collections take typed data + config as props and stay
  unopinionated about where the data came from (local, API, etc.).

## Shape of a collection

```
registry/collections/kanban/
  kanban.tsx        # the component
  kanban.mdx        # docs + live examples (definition of done)
```

_Populated in Phase 3._
