# Swift Struck UI

A **web-first, cross-platform component & collection library** you build entire
apps on top of — primitives inspired by [shadcn/ui](https://ui.shadcn.com) and
data-bound, configurable collections inspired by [Glide](https://www.glideapps.com).

**Live:** [swift-struck-ui.pages.dev](https://swift-struck-ui.pages.dev) ·
**Docs:** [/documentation](https://swift-struck-ui.pages.dev/documentation) ·
**Gallery:** [/components](https://swift-struck-ui.pages.dev/components) ·
**Staging:** [staging.swift-struck-ui.pages.dev](https://staging.swift-struck-ui.pages.dev)
(staging & live are the same build — only the URL differs).

- **~88 components** (62 primitives + 26 collections) — primitives (Button,
  Input, Dialog…), data-bound collections (List, Card, Table, Kanban, Calendar,
  Chart…), agent/app surfaces (Agent Chat, Copilot Overlay, Import Wizard, Ticket
  Thread…), and a config-driven screen engine.
- **Token-driven** — every color/size resolves to one theme; re-skin in one file.
- **Config-driven** — collections and inputs take one typed `config`; every field
  is required, so no setting is ever hidden.
- **Strictly layered** — `tokens → primitives → collections`, enforced in CI.
- **Tested & hardened** — pure logic, component rendering, interactions, and
  security regressions covered by 100+ tests in CI; links are scheme-guarded and
  rich-text is sanitized against XSS.
- **Cross-platform** — one web build, wrapped natively with Tauri (desktop) and
  Capacitor (mobile) later. No rewrite.

## Install (in another app)

The library **is** this repo — install it straight from GitHub:

```bash
# latest (tracks main)
npm install github:alaap-swift-struck/swift-struck-ui react react-dom

# or pin to a release (recommended for production apps)
npm install github:alaap-swift-struck/swift-struck-ui#v0.7.0 react react-dom
```

```tsx
import { Button } from "@swift-struck/ui/registry/primitives/button/button"
```

Every release is a git tag (`v0.7.0`, `v0.6.0`, …) — see [PROGRESS.md](PROGRESS.md)
for what changed in each.

### Required setup — the library ships TypeScript source

This is a source library (shadcn-style): you install real `.tsx` files, not compiled
JS, so the components stay readable and your app's own Tailwind theme applies. That
means **your bundler has to compile it**. In Next.js, `node_modules` isn't transpiled
by default, so add:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["@swift-struck/ui"],
}
export default nextConfig
```

Without this you'll get a syntax error on the first import — that's the missing step,
not a broken package. Then import the theme once (it carries every design token):

```tsx
// app/layout.tsx
import "@swift-struck/ui/styles.css"
```

### Updating — read this, it's the one that catches people

**A plain `npm install` will NOT pull in new library code.** npm resolves a GitHub
dependency to a **commit SHA** and locks it in your `package-lock.json`; every later
`npm install` faithfully reinstalls that same commit. An app can sit on months-old code
while its `package.json` looks current. To actually move:

```bash
# untracked/pinned → jump to a specific release
npm install github:alaap-swift-struck/swift-struck-ui#v0.7.0

# tracking main → re-resolve to the newest commit
npm update @swift-struck/ui
```

Then check what you really have — the SHA in the lockfile is the truth, not the version
field:

```bash
npm ls @swift-struck/ui
```

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
> dependency-cruiser (layering) · vitest + React Testing Library + jsdom (tests).

## License

[MIT](LICENSE).
