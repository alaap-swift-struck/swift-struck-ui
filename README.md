# Swift Struck UI

A **web-first, cross-platform component & collection library** you build entire
apps on top of — primitives inspired by [shadcn/ui](https://ui.shadcn.com) and
data-bound, configurable collections inspired by [Glide](https://www.glideapps.com).

- **~70 components** — primitives (Button, Input, Dialog…) and collections
  (List, Card, Table, Kanban, Calendar, Chart…).
- **Token-driven** — every color/size resolves to one theme; re-skin in one file.
- **Config-driven** — collections and inputs take one typed `config`; every field
  is required, so no setting is ever hidden.
- **Strictly layered** — `tokens → primitives → collections`, enforced in CI.
- **Cross-platform** — one web build, wrapped natively with Tauri (desktop) and
  Capacitor (mobile) later. No rewrite.

## Repo layout

- **`packages/ui/`** — the library, published to npm as **`@swift-struck/ui`**.
- **`app/`** — the docs & showcase site (Next.js), deployed to Cloudflare Pages.

## Develop

```bash
npm install
npm run dev        # showcase at http://localhost:3000  (and /components)
npm test           # unit tests (vitest)
npm run guardrails # enforce the tokens → primitives → collections layering
npx tsc --noEmit   # type-check
```

## Docs

- **[HANDOFF.md](HANDOFF.md)** — start here: full state + how to run/verify.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — the layering & config contract.
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to add a component.
- **[DEPLOY.md](DEPLOY.md)** — staging/live publishing (npm + Cloudflare).
- **[GLIDE-CONFIG-RESEARCH.md](GLIDE-CONFIG-RESEARCH.md)** — per-component config reference.

> Stack: Next.js 15 · React 19 · Tailwind CSS v4 · Radix UI · CVA · recharts ·
> dependency-cruiser (layering) · vitest (tests).

## License

[MIT](LICENSE).
