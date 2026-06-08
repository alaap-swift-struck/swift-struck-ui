# @swift-struck/ui

A **web-first, cross-platform component & collection library** you build entire
apps on top of — inspired by [shadcn/ui](https://ui.shadcn.com) (primitives) and
[Glide](https://www.glideapps.com) (data-bound, configurable collections).

- **~68 components** across primitives (Button, Input, Dialog…) and data-bound
  collections (List, Card, Table, Kanban, Calendar, Chart…).
- **Token-driven** — every color/size resolves to one theme; re-skin in one file.
- **Config-driven collections** — each is one typed `config` object; every field
  is required, so no setting is ever hidden.
- **Strictly layered** — `tokens → primitives → collections`, enforced in CI.

## Install

```bash
npm install @swift-struck/ui
```

Peer dependencies: `react` and `react-dom` (18 or 19).

## Use

```tsx
import { Button } from "@swift-struck/ui/registry/primitives/button/button"
import { CollectionFrame } from "@swift-struck/ui/registry/collections/collection-frame/collection-frame"
```

The package ships **TypeScript source** (so your bundler tree-shakes it and
Tailwind can see the class names). In your Tailwind v4 CSS, scan it:

```css
@import "tailwindcss";
@source "../node_modules/@swift-struck/ui/registry";
```

You also need the design tokens — copy the `@theme`/`:root` token block from the
showcase's `app/globals.css` into your own global stylesheet (a dedicated
`tokens.css` export is on the roadmap).

## Docs

Browse every component live in the showcase site (the gallery). See
`ARCHITECTURE.md` for the layering contract and `GLIDE-CONFIG-RESEARCH.md` for
the per-component config reference.

## License

MIT.
