# Swift Struck UI

A **web-first, cross-platform component & collection library** you build entire
apps on top of — primitives inspired by [shadcn/ui](https://ui.shadcn.com) and
data-bound, configurable collections inspired by [Glide](https://www.glideapps.com).

**Live:** [swift-struck-ui.pages.dev](https://swift-struck-ui.pages.dev) ·
**Docs:** [/documentation](https://swift-struck-ui.pages.dev/documentation) ·
**Gallery:** [/components](https://swift-struck-ui.pages.dev/components) ·
**Staging:** [staging.swift-struck-ui.pages.dev](https://staging.swift-struck-ui.pages.dev)
(staging & live are the same build — only the URL differs).

- **91 components** (65 primitives + 26 collections) — primitives (Button,
  Input, Dialog…), data-bound collections (List, Card, Table, Kanban, Calendar,
  Chart…), agent/app surfaces (Agent Chat, Copilot Overlay, Import Wizard, Ticket
  Thread…), and a config-driven screen engine.
- **Token-driven** — every color/size resolves to one theme; re-skin in one file.
  Doing that? Read the
  **[re-skin contrast checklist](registry/tokens/README.md#re-skinning-the-contrast-checklist)**
  first — several tokens you'd read as "brand colours" are rendered as body text
  and links, and swapping values without re-checking the floors is how a fork of
  this library ended up with 209 unreadable text nodes.
- **Config-driven** — collections and inputs take one typed `config`; every field
  is required, so no setting is ever hidden.
- **Windowed at volume** — `List`, `CardGrid` and `DataTable` render only the rows
  near the viewport past 100 rows, so a 2,000-row screen holds ~30 DOM nodes
  instead of 2,000. No prop, no fixed height and no scroll container to wire up;
  height, scrolling and behaviour are unchanged.
- **Strictly layered** — `tokens → primitives → collections`, enforced in CI.
- **Tested & hardened** — pure logic, component rendering, interactions, and
  security regressions covered by 200+ tests in CI; links are scheme-guarded and
  rich-text is sanitized against XSS.
- **Cross-platform** — one web build, wrapped natively with Tauri (desktop) and
  Capacitor (mobile) later. No rewrite.

## Install (in another app)

The library **is** this repo — install it straight from GitHub:

```bash
# latest (tracks main)
npm install github:alaap-swift-struck/swift-struck-ui react react-dom

# or pin to a release (recommended for production apps)
npm install github:alaap-swift-struck/swift-struck-ui#v0.11.0 react react-dom
```

```tsx
import { Button } from "@swift-struck/ui/registry/primitives/button/button"
```

Every release is a git tag (`v0.11.0`, `v0.10.1`, …) — see [PROGRESS.md](PROGRESS.md)
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
npm install github:alaap-swift-struck/swift-struck-ui#v0.11.0

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

### Prerequisites

| Need        | Version         | Notes                                                                                 |
| ----------- | --------------- | ------------------------------------------------------------------------------------- |
| **Node.js** | **20 or newer** | Pinned in `.nvmrc` and `package.json` `engines`; CI runs 20. `nvm use` picks it up.   |
| **npm**     | 10 or newer     | Ships with Node 20. This repo uses npm workspaces — yarn and pnpm are not configured. |
| A browser   | any modern      | For the showcase at `localhost:3000`.                                                 |

Nothing else. There is no database, no API keys and **no environment variables** —
a fresh clone runs with no configuration at all. If you'd rather not install Node,
open the repo in its devcontainer (`.devcontainer/devcontainer.json`) and skip
straight to `npm install`.

Deploying (as opposed to developing) needs a Cloudflare account — see
[OPERATIONS.md](OPERATIONS.md).

### Commands

```bash
npm install
npm run dev        # showcase at http://localhost:3000  (and /components)
npm run verify     # the full gate: typecheck + tests + layering + formatting
```

`npm run verify` is the one to run before committing. Its parts, if you want them
individually:

```bash
npx tsc --noEmit   # type-check the library
npm test           # unit tests (vitest)
npm run guardrails # enforce the tokens → primitives → collections layering
npm run format     # prettier write
```

**Green looks like:** `tsc` silent, 290 tests passing across 37 files, guardrails
reporting 0 violations, prettier reporting all files formatted.

## Docs

- **[HANDOFF.md](HANDOFF.md)** — start here: full state + how to run/verify.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — the layering & config contract.
- **[CONFIG-REFERENCE.md](CONFIG-REFERENCE.md)** — **every component, every config
  field, every option, and what each value does.**
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to add a component.
- **[registry/tokens/README.md](registry/tokens/README.md)** — the design tokens,
  and the **re-skin contrast checklist** (which tokens carry a WCAG floor, which
  floor, and how to check your own palette).
- **[OPERATIONS.md](OPERATIONS.md)** — **the operational source of truth:** deploy
  commands, accounts and credentials by name, rollback and its trigger, what to
  check when it breaks, and how to pick this project up if you inherited it.
- **[DEPLOY.md](DEPLOY.md)** — the short deploy summary; points at OPERATIONS.md.
- **[NOTICE.md](NOTICE.md)** — third-party licences and what they oblige you to do.
- **[GLIDE-CONFIG-RESEARCH.md](GLIDE-CONFIG-RESEARCH.md)** — how each maps to Glide.

> Stack: Next.js 15 · React 19 · Tailwind CSS v4 · Radix UI · CVA · recharts ·
> dependency-cruiser (layering) · vitest + React Testing Library + jsdom (tests).

## License

[MIT](LICENSE).
