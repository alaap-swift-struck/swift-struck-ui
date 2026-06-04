# brimba

A web-first, cross-platform component & collection library you build entire
applications on top of — inspired by [shadcn/ui](https://ui.shadcn.com) for the
primitives and [Glide](https://www.glideapps.com) for the data-bound
collections.

- **Primitives** — shadcn-style atoms (Button, Input, Dialog…).
- **Collections** — Glide-style data views (List, Grid, Kanban, Calendar…).
- **Copy-in** — components are source you own, pulled per-project via a registry.
- **Cross-platform** — one web build, wrapped natively with Tauri (desktop) and
  Capacitor (mobile). No rewrite.

## Status

**Phase 0 — Foundation.** The layered skeleton and the guardrails that keep it
that way are in place. Layers fill in next; see the roadmap in
[ARCHITECTURE.md](ARCHITECTURE.md).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000 — docs + showcase harness
npm run check    # enforce the architecture (run before committing)
```

## Read next

- [ARCHITECTURE.md](ARCHITECTURE.md) — the layers, the rules, the cross-platform
  plan. The contract.
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to add a component without breaking
  the rules.

> Stack: Next.js · React 19 · Tailwind CSS v4 · Radix UI · CVA ·
> dependency-cruiser (layering enforcement).
