# Swift Struck UI

A **web-first, cross-platform component & collection library** you build entire
apps on top of — primitives inspired by [shadcn/ui](https://ui.shadcn.com) and
data-bound, configurable collections inspired by [Glide](https://www.glideapps.com).

**Live:** [swift-struck-ui.pages.dev](https://swift-struck-ui.pages.dev) ·
**Docs:** [/documentation](https://swift-struck-ui.pages.dev/documentation) ·
**Gallery:** [/components](https://swift-struck-ui.pages.dev/components) ·
**Staging:** [staging.swift-struck-ui.pages.dev](https://staging.swift-struck-ui.pages.dev)
(staging & live are the same build — only the URL differs).

- **~70 components** — primitives (Button, Input, Dialog…) and collections
  (List, Card, Table, Kanban, Calendar, Chart…).
- **Token-driven** — every color/size resolves to one theme; re-skin in one file.
- **Config-driven** — collections and inputs take one typed `config`; every field
  is required, so no setting is ever hidden.
- **Strictly layered** — `tokens → primitives → collections`, enforced in CI.
- **Cross-platform** — one web build, wrapped natively with Tauri (desktop) and
  Capacitor (mobile) later. No rewrite.

## Install (in another app)

The library **is** this repo — install it straight from GitHub, no npm account needed:

```bash
npm install github:alaap-swift-struck/swift-struck-ui react react-dom
```

```tsx
import { Button } from "@swift-struck/ui/registry/primitives/button/button"
```

To pull in later updates, re-run the install (it re-fetches the latest from GitHub).

## Repo layout

- **root** (`registry/`, `lib/`, `registry.json`) — the library itself,
  published as **`@swift-struck/ui`**. This is what GitHub-install gives you.
- **`www/`** — the docs & showcase site (Next.js), deployed to Cloudflare Pages.

## Develop

```bash
npm install
npm run dev        # showcase at http://localhost:3000  (and /components)
npm test           # unit tests (vitest)
npm run guardrails # enforce the tokens → primitives → collections layering
npx tsc --noEmit   # type-check the library
```

## Docs

- **[HANDOFF.md](HANDOFF.md)** — start here: full state + how to run/verify.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — the layering & config contract.
- **[CONFIG-REFERENCE.md](CONFIG-REFERENCE.md)** — **every component, every config
  field, every option, and what each value does.**
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to add a component.
- **[DEPLOY.md](DEPLOY.md)** — staging/live publishing (Cloudflare Pages).
- **[GLIDE-CONFIG-RESEARCH.md](GLIDE-CONFIG-RESEARCH.md)** — how each maps to Glide.

> Stack: Next.js 15 · React 19 · Tailwind CSS v4 · Radix UI · CVA · recharts ·
> dependency-cruiser (layering) · vitest (tests).

## License

[MIT](LICENSE).
